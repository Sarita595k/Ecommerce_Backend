import express from "express";
const router = express.Router();
import { deleteProduct, getProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/productController.js";
import { authorizedRole, isAuthenticated } from "../middlewares/auth.js";


// router for getting all products 
router.get('/', getProducts)

// router for getting single product
router.get('/:id', getSingleProduct)

// router for adding new product
router.post('/seller/new', isAuthenticated, authorizedRole('seller'), newProduct)

// router for updating product
router.put('/seller/:id', isAuthenticated, authorizedRole('seller'), updateProduct)

// router for deleting product
router.delete('/seller/:id', isAuthenticated, authorizedRole('seller'), deleteProduct)
export default router

// end of code