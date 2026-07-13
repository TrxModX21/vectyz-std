import {
  Currency,
  PaymentStatus,
  TransactionType,
} from "../generated/prisma/enums";
import { createSnapTransaction } from "../lib/midtrans";
import { polar } from "../lib/polar";
import prisma from "../lib/prisma";
import { NotFoundException } from "../utils/app-error";
import { config } from "../utils/app.config";
import { convertCreditToRealCurrency } from "../utils/helper";
import { TopUpGatewayType } from "../validation/topup.validation";

export const topUpMidtransGatewayService = async (
  currentUserId: string,
  input: TopUpGatewayType,
) => {
  const user = await prisma.user.findUnique({ where: { id: currentUserId } });
  if (!user) throw new NotFoundException("User not found");

  const amountRupiah = convertCreditToRealCurrency(input.creditAmount, "IDR");

  const transaction = await prisma.transaction.create({
    data: {
      userId: currentUserId,
      type: TransactionType.TOPUP_CREDIT,
      amount: amountRupiah,
      amountCurrency: Currency.IDR,
      creditAmount: input.creditAmount,
      status: PaymentStatus.PENDING,
    },
  });

  const snap = await createSnapTransaction({
    order_id: transaction.id,
    gross_amount: amountRupiah,
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: "TOPUP-CREDIT",
        price: amountRupiah,
        quantity: 1,
        name: `${input.creditAmount} Credits`,
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
  };
};

export const topUpPolarGatewayService = async (
  currentUserId: string,
  input: TopUpGatewayType,
  ipAddress: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: currentUserId } });
  if (!user) throw new NotFoundException("User not found");
  const amountUsd = convertCreditToRealCurrency(input.creditAmount, "USD");

  const transaction = await prisma.transaction.create({
    data: {
      userId: currentUserId,
      type: TransactionType.TOPUP_CREDIT,
      amount: Math.round(amountUsd * 100), // convert in cents,
      amountCurrency: Currency.USD,
      creditAmount: input.creditAmount,
      status: PaymentStatus.PENDING,
    },
  });

  const checkout = await polar.checkouts.create({
    products: [config.POLAR_VECTOLIO_EXTRA_CREDIT_PRODUCT_ID as string],
    amount: Math.round(amountUsd * 100), // convert in cents
    customerEmail: user.email,
    customerName: user.name,
    externalCustomerId: user.id,
    embedOrigin: config.CLIENT_URL as string,
    allowDiscountCodes: false,
    customerIpAddress: ipAddress,
    metadata: {
      transactionId: transaction.id,
    },
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
