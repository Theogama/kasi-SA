import axios from "axios";
import { supabase } from "../config/supabase.js";

const YOCO_API_URL = "https://api.yoco.com/v1";
const YOCO_SECRET_KEY = process.env.VITE_YOCO_SECRET_KEY;

export const processYocoPayment = async (req, res) => {
  try {
    const { userId } = req;
    const { token, orderId, amount, currency = "ZAR" } = req.body;

    if (!token || !orderId || !amount) {
      return res.status(400).json({ error: "Missing required fields: token, orderId, amount" });
    }

    // Verify order belongs to user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", userId)
      .single();

    if (!order || orderError) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create charge with Yoco
    const chargeData = {
      token: token,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        orderId: orderId,
        userId: userId,
      },
    };

    const response = await axios.post(
      `${YOCO_API_URL}/charges`,
      chargeData,
      {
        auth: {
          username: YOCO_SECRET_KEY,
          password: "",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { id: chargeId, status } = response.data;

    // Save payment record
    const { error: paymentError } = await supabase.from("payments").insert([
      {
        order_id: orderId,
        payment_method: "yoco",
        payment_reference: chargeId,
        amount: amount,
        status: status === "succeeded" ? "success" : "pending",
        response_data: response.data,
      },
    ]);

    if (paymentError) throw paymentError;

    // Update order payment status
    if (status === "succeeded") {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", orderId);

      if (updateError) throw updateError;
    }

    res.json({
      success: status === "succeeded",
      chargeId: chargeId,
      status: status,
      message: status === "succeeded" ? "Payment processed successfully" : "Payment pending",
    });
  } catch (error) {
    console.error("Yoco payment error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Payment processing failed",
      details: error.response?.data?.message || error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { chargeId } = req.body;

    if (!chargeId) {
      return res.status(400).json({ error: "Charge ID is required" });
    }

    // Check payment status with Yoco
    const response = await axios.get(
      `${YOCO_API_URL}/charges/${chargeId}`,
      {
        auth: {
          username: YOCO_SECRET_KEY,
          password: "",
        },
      }
    );

    const { status } = response.data;

    res.json({
      chargeId: chargeId,
      status: status,
      verified: status === "succeeded",
    });
  } catch (error) {
    console.error("Verification error:", error.message);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

export const webhookHandler = async (req, res) => {
  try {
    const { id, status, metadata } = req.body;
    const { orderId } = metadata || {};

    if (!orderId) {
      return res.status(400).json({ error: "Invalid webhook data" });
    }

    // Update payment status
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: status === "succeeded" ? "success" : "failed",
      })
      .eq("payment_reference", id);

    if (paymentError) throw paymentError;

    // Update order status if payment succeeded
    if (status === "succeeded") {
      await supabase
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", orderId);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
