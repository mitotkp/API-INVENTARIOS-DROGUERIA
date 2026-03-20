import { Router } from "express";
import { SellersControllers } from "../controllers/sellersController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();
router.post('/login', SellersControllers.login); 
router.post('/logout', SellersControllers.logout);
router.get('/getSellers', verificarToken, SellersControllers.getSellers); 

export default router; 