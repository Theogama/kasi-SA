import express from "express";
import { processYocoPayment, verifyPayment, webhookHandler, payfastNotify } from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.post("/yoco/process", authenticate, processYocoPayment);
router.post("/yoco/verify", authenticate, verifyPayment);

// Webhooks / callbacks
router.post("/yoco/webhook", webhookHandler);
router.post("/payfast/notify", payfastNotify);

export default router;
