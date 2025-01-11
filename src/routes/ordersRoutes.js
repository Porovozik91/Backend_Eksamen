import express from "express";
import { addOrders, deleteOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/ordersController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/inputTypeValidation.js";

const router = express.Router();

// Employee 
router.post("/orders", authMiddleware("employee", "admin"), validateRequest("orders"), addOrders);
router.get("/orders", authMiddleware("employee", "admin"), getAllOrders);
router.get("/orders/:id", authMiddleware("employee", "admin"), getOrderById);
router.put("/orders/:id", authMiddleware("employee", "admin"), validateRequest("updateStatus"), updateOrderStatus);
router.delete("/orders/:id", authMiddleware("admin"), deleteOrder);

// Admin 
router.get("/admin/orders", authMiddleware("admin"), getAllOrders);
router.put("/admin/orders/:id", authMiddleware("admin"), validateRequest("updateStatus"), updateOrderStatus);

export default router;
