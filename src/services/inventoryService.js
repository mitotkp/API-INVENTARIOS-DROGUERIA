import { getConnection, sql } from "../config/dbConfig.js";
import { inventoryQuerys } from "../querys/apiQuerys.js";
import { uuidGenerator } from "../utils/generateIdCount.js";

export class InventoryService {

    static async getPedidos (busqueda, page, limit) {
        try{
            const offset = (page - 1) * limit; 
            if(!busqueda) busqueda = null;
            if(!page) page = 1; 
            if(!limit) limit = 30; 

            const pool = await getConnection();

            const result = await pool
                .request()
                .input('BUSQUEDA', sql.NVarChar, busqueda)
                .input('OFFSET', sql.Int, offset)
                .input('LIMIT', sql.Int, limit)
                .query(inventoryQuerys.getPedidos); 

            const total = await pool
                .request()
                .input('BUSQUEDA', sql.NVarChar, busqueda)
                .query(inventoryQuerys.countPedidos); 
            
            return {
                data: result.recordset,
                totalItems: total.recordset[0].total,
                totalPages: Math.ceil(total.recordset[0].total / limit),
                currentPage: page, 
                limit, 
            }

        } catch (error) {
            console.error("Error al listar los pedidos"); 
            throw error; 
        }
    }

    static async getPedido (codPedido) {
        try{
            const pool = await getConnection();

            const result = await pool.request()
                .input("ORDERID", sql.NVarChar, codPedido)
                .query(inventoryQuerys.getPedido)
            
            if(result.recordset.length === 0){
                console.log("No se pudo encontrar el pedido");
                return
            }

            const pedido = result.recordset[0]; 

            const detallesPedido = await pool.request()
                .input('ORDERID', sql.NVarChar, codPedido)
                .query(inventoryQuerys.getDetailPedido)

            if(detallesPedido.recordset.length === 0){
                console.log('No hay detalles del pedido'); 
                return
            }

            const lineaPedido = detallesPedido.recordset; 

            return {
                pedido,
                detalle: lineaPedido
            }

        }catch(error){
            console.error("Error al traer los detalles del pedido.")
            throw error; 
        }
    }

    static async getCounts(busqueda, page, limit) {
        try{
            const pool = await getConnection(); 

            const offset = (page - 1) * limit; 
            if(!busqueda) busqueda = null;
            if(!page) page = 1; 
            if(!limit) limit = 30; 

            const result = await pool 
                .request()
                .input('BUSQUEDA', sql.NVarChar, busqueda)
                .input('OFFSET', sql.Int, offset)
                .input('LIMIT', sql.Int, limit)
                .query(inventoryQuerys.getConteos)

            
            const total = await pool
                .request()
                .input('BUSQUEDA', sql.NVarChar, busqueda)
                .query(inventoryQuerys.countRowsConteos); 
            
            return {
                data: result.recordset,
                totalItems: total.recordset[0].total,
                totalPages: Math.ceil(total.recordset[0].total / limit),
                currentPage: page, 
                limit, 
            }
        }  
        catch(error){
            console.error("Error al listar conteos"); 
            throw error; 
        }
    }

    static async getCount(idConteo) {
        try{
            const pool = await getConnection();

            const result = await pool.request()
                .input("CONTEO", sql.NVarChar, idConteo)
                .query(inventoryQuerys.getConteoById)
            
            if(result.recordset.length === 0){
                return {
                    ok: false, 
                    message: 'No se pudo encontrar el conteo'
                }
            }

            const conteo = result.recordset[0]; 

            const detallesConteo = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.getDetailConteo)

            if(detallesConteo.recordset.length === 0){
                return{
                    ok: false, 
                    message: 'No hay detalles del conteo'
                }
            }

            const lineaConteo = detallesConteo.recordset; 

            return {
                conteo,
                detalle: lineaConteo
            }

        }catch(error){
            console.error("Error al traer los detalles del conteo")
            throw error; 
        }
    }

    static async getCountsBySeller(vendedor, busqueda, page, limit) {
        try{
            const offset = (page - 1) * limit; 
            if(!busqueda) busqueda = null;
            if(!page) page = 1; 
            if(!limit) limit = 30; 

            const pool = await getConnection();

            const result = await pool 
                .request()
                .input('BUSQUEDA', sql.NVarChar, busqueda)
                .input('OFFSET', sql.Int, offset)
                .input('LIMIT', sql.Int, limit)
                .input('VENDEDOR', sql.Int, vendedor)
                .query(inventoryQuerys.getConteoBySeller)

            const total = await pool 
                .request()
                .input('BUSQUEDA', sql.NVarChar, busqueda)
                .input('VENDEDOR', sql.Int, vendedor)
                .query(inventoryQuerys.countRowsConteosBySeller)

            return {
                data: result.recordset,
                totalItems: total.recordset[0].total,
                totalPages: Math.ceil(total.recordset[0].total / limit),
                currentPage: page, 
                limit, 
            }    

        }catch(error){
            console.error("Error al listar los conteos del vendedor"); 
            throw error; 
        }
    }

    static async getCountBySeller(idConteo, vendedor) {
            try{
                const pool = await getConnection(); 

                const result = await pool.request()
                    .input('CONTEO', sql.NVarChar, idConteo)
                    .input('VENDEDOR', sql.Int, vendedor)
                    .query(inventoryQuerys.getOneConteoBySeller); 

                if(result.recordset.length === 0){
                    return {
                        ok: false, 
                        message: 'No se pudo encontrar el conteo'
                    }
                }

                const conteo = result.recordset[0]; 

                const detallesConteo = await pool.request()
                    .input('CONTEO', sql.NVarChar, idConteo)
                    .input('VENDEDOR', sql.Int, vendedor )
                    .query(inventoryQuerys.getDetailConteoBySeller); 

                if(detallesConteo.recordset.length === 0){
                    return{
                        ok: false, 
                        message: 'No hay detalles del conteo'
                    }
                }

                const lineaConteo = detallesConteo.recordset; 

                return{
                    conteo, 
                    detalle: lineaConteo
                }

            }catch(error){
                console.error("Error al traer los detalles del pedido.")
                throw error; 
            }
    }

    static async joinCount(idConteo, vendedor, ip) {
        try{
            const pool = await getConnection();

            const check = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo )
                .input('VENDEDOR', sql.Int, vendedor)
                .query(inventoryQuerys.getSellerCount)

            if(check.recordset.length > 0){
                return { 
                    ok: false, 
                    message: 'Ya te encuentras en este conteo, no te puedes volver a unir'
                }; 
            }

            const pedido = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.checkPedidoByCount)

            //console.log(pedido.recordset.length)
        
            if(pedido.recordset.length === 0){
                return { 
                    ok: false, 
                    message: 'Ha ocurrido un error o no existe el conteo para unirse' 
                }; 
            }

            const insertSeller = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .input('VENDEDOR', sql.Int, vendedor)
                .input('IP', sql.NVarChar, ip)
                .query(inventoryQuerys.insertSellerCount);

            return {
                ok: true,
                message: 'Te has unido exitosamente al conteo'
            };

        }catch(error){
            console.error("Error al traer los detalles del pedido.")
            throw error; 
        }
    }

    static async createCount(idPedido, vendedor, ip) {
        const pool = await getConnection();
        
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();
            
            const idConteo = uuidGenerator.nuevoUUID();

            const result = await transaction.request()
                .input('PEDIDO', sql.NVarChar, idPedido)
                .input('CONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.createPedido);

            const insertSeller = await transaction.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .input('VENDEDOR', sql.Int, vendedor)
                .input('IP', sql.NVarChar, ip)
                .query(inventoryQuerys.insertSellerCount);

            await transaction.commit();
            console.log("Transacción exitosa. Todo se guardó correctamente.");

            return result.recordset; 

        } catch(error) {
            console.error("Fallo detectado al crear el conteo. Iniciando Rollback...");
            
            try {
                await transaction.rollback();
                console.log("Rollback completado: Ningún cambio fue guardado en la BD.");
            } catch (rollbackError) {
                console.error("Error crítico: No se pudo hacer el rollback", rollbackError);
            }
            
            throw error; 
        }
    }

    static async checkCount (idPedido) {
        try{
            const pool = await getConnection(); 

            const check = await pool 
                .request()
                .input('PEDIDO', sql.NVarChar, idPedido)
                .query(inventoryQuerys.getConteo)
            
            const checkConteo = check.recordset; 

            if(checkConteo.length === 0){
                return {
                    conteo: false
                }
            } else {

                return{
                    conteo: true
                }
             
            }

        }catch(error){
            console.error("No se ha encontrado el conteo");
        }
    }

    static async insertCountLine (idConteo, codVendedor, articuloData) {
        try{
            const pool = await getConnection(); 

            const validacion = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .input('VENDEDOR', sql.Int, codVendedor)
                .query(inventoryQuerys.getSellerCount)

            if(validacion.length === 0){
                return {
                    ok: false, 
                    message: 'Acceso denegado: No te has unido a este conteo. Por favor únete primero.'
                }
            }

            const result = await pool.request()
                .input('IDCONTEO', sql.NVarChar, idConteo)
                .input('CODARTICULO', sql.Int, articuloData.codArticulo)
                .input('TALLA', sql.NVarChar, '.')
                .input('COLOR', sql.NVarChar, '.')
                .input('UNIDADES', sql.Int, articuloData.unidades)
                .input('UNIDADESOLICITADAS', sql.Int, articuloData.unidadesSolicitadas)
                .input('CODVENDEDOR', sql.Int, codVendedor)
                .query(inventoryQuerys.insertProductLine)

                return {
                    ok: true, 
                    message: 'Artìculo registrado en el conteo exitosamente'
                }

        }catch(error){
            console.error("Error en el servicio al insertar línea de conteo:", error);
            throw error;
        }
    }

}