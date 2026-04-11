import { Router } from "express";
import { InventoryControllers } from "../controllers/inventoryController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router(); 

router.get('/getOrders', verificarToken, InventoryControllers.ordersList); 
router.get('/getOneOrder', verificarToken, InventoryControllers.oneOrder); 
router.get('/getCounts', verificarToken, InventoryControllers.countsList); 
router.get('/getCount', verificarToken, InventoryControllers.oneCount)
router.get('/getCountsBySeller', verificarToken, InventoryControllers.countListBySeller); 
router.get('/getCountBySeller', verificarToken, InventoryControllers.oneCountBySeller); 
router.post('/createCount', verificarToken, InventoryControllers.createCount); 
router.post('/joinCount', verificarToken, InventoryControllers.joinCount); 
router.post('/scanProduct', verificarToken, InventoryControllers.scanProduct);
router.get('/verifyCount', verificarToken, InventoryControllers.verifyCount); 
router.post('/closeCount', verificarToken, InventoryControllers.closeCount);
router.get('/getOrderDetails', verificarToken, InventoryControllers.orderDetails);
router.post('/createBulto', verificarToken, InventoryControllers.createNewBulto);
router.get('/getBultos', verificarToken, InventoryControllers.getBultos);
export default router; 