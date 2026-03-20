import { Router } from "express";
import { ArticlesController } from "../controllers/articlesController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router(); 

router.get('/getArticles', verificarToken, ArticlesController.articlesList); 
router.get('/getDptos', verificarToken, ArticlesController.dptosList); 
router.get('/getSections', verificarToken, ArticlesController.sectionsList); 
router.get('/getBrands', verificarToken,  ArticlesController.brandList); 
router.get('/getFamilies', verificarToken, ArticlesController.familiesList); 
router.get('/getSubFamilies', verificarToken, ArticlesController.subFamiliesList); 

export default router;  