import {
  Currency,
  PaymentStatus,
  TransactionType,
} from "../generated/prisma/enums";
import { createSnapTransaction } from "../lib/midtrans";
import { polar } from "../lib/polar";
import prisma from "../lib/prisma";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { config } from "../utils/app.config";
import { convertCreditToRealCurrency } from "../utils/helper";
import { SubscriptionType } from "../validation/subscribe.validation";

export const subscribePolarGatewayService = async (
  currentUserId: string,
  input: SubscriptionType,
  ipAddress: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: currentUserId } });
  if (!user) throw new NotFoundException("User not found");

  const plan = await prisma.plan.findUnique({ where: { id: input.planId } });
  if (!plan) throw new NotFoundException("Plan not found");

  const productId =
    input.billingCycle === "YEARLY"
      ? plan.polarYearlyProductId
      : plan.polarMonthlyProductId;
  if (!productId) {
    throw new BadRequestException(
      `Polar product ID for ${input.billingCycle} is not avail for this plan.`,
    );
  }

  let amountUsd = convertCreditToRealCurrency(plan.price, "USD"); // Default amount usd in one time (2 days)
  let periodDays = plan.durationDays; // Default one time (2 days)
  let creditAmount = plan.price; // Default one time (2 days)

  if (input.billingCycle === "YEARLY") {
    if (plan.priceInYear) {
      amountUsd = convertCreditToRealCurrency(plan.priceInYear, "USD");
      creditAmount = plan.priceInYear;
      periodDays = 365;
    } else {
      throw new BadRequestException(`This product ID not supported Yearly`);
    }
  } else if (input.billingCycle === "MONTHLY") {
    if (plan.isSupportMonthly) {
      amountUsd = convertCreditToRealCurrency(plan.price, "USD");
      creditAmount = plan.price;
      periodDays = plan.durationDays;
    } else {
      throw new BadRequestException(`This product ID not supported Monthly`);
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: currentUserId,
      type: TransactionType.SUBSCRIPTION,
      amount: Math.round(amountUsd * 100), // convert in cents,
      creditAmount,
      amountCurrency: Currency.USD,
      planId: plan.id,
      status: PaymentStatus.PENDING,
      billingCycle: input.billingCycle,
      periodDays: periodDays,
    },
  });

  const checkout = await polar.checkouts.create({
    products: [productId],
    customerEmail: input.billingAddress?.email || user.email,
    customerName: input.billingAddress?.name || user.name,
    externalCustomerId: user.id,
    embedOrigin: config.CLIENT_URL as string,
    allowDiscountCodes: false,
    customerIpAddress: ipAddress,
    metadata: {
      transactionId: transaction.id,
    },
    successUrl: `${config.CLIENT_URL}/pricing?success=true`,
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { externalId: checkout.id },
  });

  return {
    transactionId: transaction.id,
    polarCheckoutUrl: checkout.url,
  };
};

export const subscribeMidtransGatewayService = async (
  currentUserId: string,
  input: SubscriptionType,
) => {
  const user = await prisma.user.findUnique({ where: { id: currentUserId } });
  if (!user) throw new NotFoundException("User not found");

  const plan = await prisma.plan.findUnique({ where: { id: input.planId } });
  if (!plan) throw new NotFoundException("Plan not found");

  const billingAddress = input.billingAddress;

  let amountIdr = convertCreditToRealCurrency(plan.price, "IDR"); // Default amount idr in one time (2 days)
  let periodDays = plan.durationDays; // Default one time (2 days)
  let creditAmount = plan.price; // Default one time (2 days)
  let itemName = `${plan.name} Subscription (${input.billingCycle})`;

  if (input.billingCycle === "YEARLY") {
    if (plan.priceInYear) {
      amountIdr = convertCreditToRealCurrency(plan.priceInYear, "IDR");
      creditAmount = plan.priceInYear;
      periodDays = 365;
    } else {
      throw new BadRequestException(
        `This plan does not support Yearly billing.`,
      );
    }
  } else if (input.billingCycle === "MONTHLY") {
    if (!plan.isSupportMonthly) {
      throw new BadRequestException(
        `This plan does not support Monthly billing.`,
      );
    }
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: currentUserId,
      type: TransactionType.SUBSCRIPTION,
      amount: amountIdr,
      creditAmount,
      amountCurrency: Currency.IDR,
      planId: plan.id,
      status: PaymentStatus.PENDING,
      billingCycle: input.billingCycle,
      periodDays: periodDays,
    },
  });

  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: amountIdr,
    customer_details: {
      first_name: input.billingAddress.name || user.name,
      email: input.billingAddress.email || user.email,
      phone: input.billingAddress?.phone || "",
      billing_address: {
        first_name: billingAddress.name,
        email: billingAddress.email,
        phone: billingAddress.phone,
        address: billingAddress.address,
        city: billingAddress.city,
        postal_code: billingAddress.postalCode,
        country_code: billingAddress.country?.substring(0, 3).toUpperCase(),
      },
    },
    item_details: [
      {
        id: plan.id,
        price: amountIdr,
        quantity: 1,
        name: itemName,
      },
    ],
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { snapToken: snap.token, externalId: snap.token },
  });

  return {
    transactionId: transaction.id,
    snapToken: snap.token,
    redirectUrl: snap.redirect_url,
  };
};
