import { getConnection, sql } from "../config/dbConfig.js";
import { ArticlesQuerys } from "../querys/apiQuerys.js";

export class ArticlesService {

    static async getArticles (busqueda, page, limit) {
        try {
            const offset = (page - 1) * limit; 
            if(!busqueda) busqueda = null; 
            if(!page) page = 1; 
            if(!limit) limit = 30; 

            const pool = await getConnection(); 
    
            const result = await pool 
                .request()
                .input('BUSQUEDA', sql.NVarChar, busqueda)
                .input("OFFSET", sql.Int, offset)
                .input("LIMIT", sql.Int, limit)
                .query(ArticlesQuerys.getArticles);
            
            const total = await pool 
                .request()
                .input("BUSQUEDA", sql.NVarChar, busqueda)
                .query(ArticlesQuerys.contarArticulos);
            
            return {
                data: result.recordset,
                totalItems: result.recordset[0].total,
                totalPages: Math.ceil(total.recordset[0].total / limit),
                currentPage: page, 
                limit, 
            }; 
        } catch (error) {
            console.error("Error al listar los articulos:", error); 
            throw error; 
        }
    }

    static async getDptos () {
        try{
            const pool = await getConnection(); 

            const result = await pool.request().query(ArticlesQuerys.getDptos);

            return { 
                data: result.recordset
            }

        }catch(error){
            console.error("Error al listar los departamentos:", error); 
            throw error; 
        }
    }

    static async getSections () {
          try{
            const pool = await getConnection(); 

            const result = await pool.request().query(ArticlesQuerys.getSections);

            return { 
                data: result.recordset
            }

        }catch(error){
            console.error("Error al listar las secciones:", error); 
            throw error; 
        }
    }

    static async getBrands () {
        try {
            const pool = await getConnection(); 

            const result = await pool.request().query(ArticlesQuerys.getBrand);

            return {
                data: result.recordset
            }
        } catch(error) {   
            console.error("Error al listar las marcas:", error); 
            throw error; 
        }
    }

    static async getFamilies () {
        try {
            const pool = await getConnection(); 

            const result = await pool.request().query(ArticlesQuerys.getFamilies);

            return {
                data: result.recordset
            }
        } catch (error) {
            console.error("Error al listar las familias: ", error); 
            throw error;
        }
    }

    static async getSubFamilies () {
        try {
            const pool = await getConnection(); 
            
            const result = await pool.request().query(ArticlesQuerys.getsubFamilies); 

            return {
                data: result.recordset
            }
            
        } catch (error) {
            console.error("Error al listar las sub-familias: ", error); 
            throw error; 
        }
    }
}