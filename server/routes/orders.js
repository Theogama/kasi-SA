import express from "express";
import {
  createOrder,
  getOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.post("/", authenticate, createOrder);
router.get("/user", authenticate, getUserOrders);
router.get("/:orderId", authenticate, getOrder);
router.patch("/:orderId", authenticate, updateOrderStatus);

export default router;
