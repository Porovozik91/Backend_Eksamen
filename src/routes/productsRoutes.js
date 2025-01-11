import express from "express";
import { 
addProducts, deleteProduct, getAllProducts, getProductById, updateProduct 
} from "../controllers/productsController.js";
import validateRequest from "../middleware/inputTypeValidation.js";


import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//employee
router.post("/products", authMiddleware("employee", "admin"), validateRequest("products"), addProducts);
router.get("/products", authMiddleware("employee", "admin"), getAllProducts);
router.get("/products/:id", authMiddleware("employee", "admin"), getProductById);
router.put("/products/:id", authMiddleware("employee", "admin"), validateRequest("products"), updateProduct);
router.delete("/products/:id", authMiddleware("employee", "admin"), deleteProduct);

//admin
router.get("/admin/products", authMiddleware("admin"), getAllProducts);
router.put("/admin/products/:id", authMiddleware("admin"), validateRequest("products"), updateProduct);

export default router;