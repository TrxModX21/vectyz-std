import midtransClient from "midtrans-client";
import { config } from "../utils/app.config";

// --- INIT SNAP (Untuk Transaksi Frontend) ---
// @ts-ignore
export const snap = new midtransClient.Snap({
  isProduction: config.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: config.MIDTRANS_SERVER_KEY as string,
  clientKey: config.MIDTRANS_CLIENT_KEY as string,
});

// --- INIT CORE API (Untuk Cek Status & Verifikasi) ---
// @ts-ignore
export const coreApi = new midtransClient.CoreApi({
  isProduction: config.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: config.MIDTRANS_SERVER_KEY as string,
  clientKey: config.MIDTRANS_CLIENT_KEY as string,
});

/**
 * Membuat Token SNAP untuk pembayaran
 * @param params Parameter transaksi (order_id, gross_amount, customer_details, dll)
 * @returns { token: string, redirect_url: string }
 */
export const createSnapTransaction = async (params: {
  order_id: string;
  gross_amount: number;
  customer_details?: {
    first_name: string;
    email: string;
    phone?: string;
  };
  item_details?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}) => {
  const transactionParams = {
    transaction_details: {
      order_id: params.order_id,
      gross_amount: params.gross_amount,
    },
    customer_details: params.customer_details,
    item_details: params.item_details,
    credit_card: {
      secure: true,
    },
  };

  try {
    // @ts-ignore
    const transaction = await snap.createTransaction(transactionParams);
    return transaction; // { token, redirect_url }
  } catch (error) {
    console.error("Midtrans Snap Error:", error);
    throw new Error("Payment Gateway Error");
  }
};

/**
 * Memverifikasi Notifikasi Webhook dari Midtrans
 * @param notificationBody JSON body dari webhook midtrans
 * @returns Status transaksi yang sudah divalidasi
 */
export const verifyPaymentNotification = async (notificationBody: any) => {
  try {
    // @ts-ignore
    const statusResponse = await coreApi.transaction.notification(notificationBody);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction Check: ${orderId} -> ${transactionStatus} (${fraudStatus})`);

    let isPaid = false;
    let isCancelled = false;

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
         // Pembayaran kartu kredit yang mencurigakan, bisa ditolak/pending
         isPaid = false;
      } else if (fraudStatus == "accept") {
         isPaid = true;
      }
    } else if (
      transactionStatus == "settlement" || 
      transactionStatus == "capture" // Kadang instant capture dianggap paid
    ) {
      isPaid = true;
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      isCancelled = true;
    }

    return {
      orderId,
      transactionStatus,
      fraudStatus,
      isPaid,
      isCancelled,
      rawResponse: statusResponse
    };

  } catch (error) {
     console.error("Midtrans Notification Error:", error);
     throw error;
  }
};
