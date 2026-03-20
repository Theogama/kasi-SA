import express from "express";
import { processYocoPayment, verifyPayment, webhookHandler } from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.post("/yoco/process", authenticate, processYocoPayment);
router.post("/yoco/verify", authenticate, verifyPayment);

// Webhook (no auth required - Yoco sends server-to-server)
router.post("/yoco/webhook", webhookHandler);

export default router;
