import { getConnection, sql } from "../config/dbConfig.js";
import { sellerQUerys } from "../querys/apiQuerys.js";
import { encriptacion } from "../utils/encriptacion.js";
import jwt from 'jsonwebtoken'; 

export class SellersService {

    static async getSellers () {
        try{
            const pool = await getConnection()
            const result = await pool.request().query(sellerQUerys.getSellers);

            return {
                data: result.recordset
            }
        }catch(error){
            console.error("Error al listar los vendedores"); 
            throw error; 
        }
    }

    static async loginSeller (password) {
        const pool = await getConnection(); 

        const passwordEncriptada = encriptacion.encriptar(password);

        const result = await pool.request()
            .input('PASSENTRADA', sql.VarChar, passwordEncriptada)
            .query(sellerQUerys.getSeller); 
        
        if(result.recordset.length === 0) {
            throw new Error("contraseña incorrecta"); 
        }
        
        const seller = result.recordset[0]; 

        if (seller.NEWPASSENTRADA !== passwordEncriptada) {
            throw new Error("contraseña incorrecta");
        }

        const secretKey = process.env.JWT_SECRET || ''
        const token = jwt.sign(
            {
                codVendedor: seller.CODVENDEDOR,
                nombre: seller.NOMVENDEDOR
            },
            secretKey, 
            { expiresIn: '12h' }
        ); 

        await pool.request()
            .input('CODVENDEDOR', sql.Int, seller.CODVENDEDOR)
            .query(sellerQUerys.cleansToken); 

        await pool.request()
            .input('CODVENDEDOR', sql.Int, seller.CODVENDEDOR)
            .input('TOKEN', sql.VarChar, token)
            .query(sellerQUerys.insertToken); 

        return {
            token, 
            user: {
                codVendedor: seller.CODVENDEDOR,
                nombre: seller.NOMVENDEDOR
            }
        }
    }

    static async logoutSeller (token) {
        const pool = await getConnection(); 

        const result = await pool.request()
            .input('TOKEN', sql.VarChar, token)
            .query(sellerQUerys.invalidToken); 


            if (result.rowsAffected[0] === 0) {
                throw new Error("La sesion ya estaba cerrada o el token es invalido");
            }

        return true; 
    }
}