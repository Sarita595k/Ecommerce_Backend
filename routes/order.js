import express from "express";
const route = express.Router();
import { isAuthenticated } from "../middlewares/auth.js";
import { newOrder } from "../controllers/orderController.js";

// for new Order
route.post('/new', isAuthenticated, newOrder)
export default route