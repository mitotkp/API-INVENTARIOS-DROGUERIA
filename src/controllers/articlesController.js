import { ArticlesService } from "../services/articlesService.js";

export class ArticlesController {

    static articlesList = async (req, res) => {
        try{
            let { q, page, limit } = req.query; 

            console.log(page, limit)

            if(!page || !limit) {
                page = 1 
                limit = 20
            }

            if(!q) q = null; 

            const articulos = await ArticlesService.getArticles(q, parseInt(page), parseInt(limit)); 

            res.status(200).json({ ok: true, ...articulos, })
        }
        catch (error) {
            console.error("Error al listar los articulos:", error); 
            res.status(500).json({ ok: false, error: "Error al listar articulos" });
        }
    }; 

    static dptosList = async (req, res) => {

        try {
            const dptos = await ArticlesService.getDptos(); 

            res.status(200).json({
                ok: true, 
                dptos: dptos.data
            })

        }
        catch (error) {
            console.error("Error al obtener los departamentos:", error); 
            res.status(500).json({ ok: false,  error: "Error al obtener los departamentos" }); 
        }

    }

    static sectionsList = async (req, res) => {

        try {
            const sections = await ArticlesService.getSections(); 

            res.status(200).json({
                ok: true, 
                sections: sections.data 
            })

        }
        catch (error) {
            console.error("Error al obtener las secciones:", error); 
            res.status(500).json({ ok: false, error: "Error al obtener secciones" }); 
        }

    }

    static brandList = async (req, res) => {
        try {
            const brands = await ArticlesService.getBrands(); 

            res.status(200).json({
                ok: true,
                brands: brands.data
            })
        }
        catch (error) {
            console.error("Error al obtener las marcas: ", error); 
            res.status(500).json({ ok: false,  error: "Error al obtener las marcas" }); 
        }
    }

    static familiesList = async (req, res) => {
        try {
            const families = await ArticlesService.getFamilies(); 

            res.status(200).json({
                ok: true,
                families: families.data
            })

        } catch (error) {
            console.error("Error al obtener las familias: ", error); 
            res.status(500).json({ ok: false, error: "Error al obtener las familias "});
        }
    }

    static subFamiliesList = async (req, res) => {
        try {
            const subFamilies = await ArticlesService.getSubFamilies(); 

            res.status(200).json({
                ok: true,
                subFamilies: subFamilies.data
            })
        } catch (error) {
            console.error("Error al obtener las sub-familias: ", error);
            res.status(500).json({ ok: false,  error: "Error al obtener las subfamilias " }); 
        }
    }





}