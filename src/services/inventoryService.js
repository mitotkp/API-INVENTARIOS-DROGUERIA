import { getConnection, sql } from "../config/dbConfig.js";
import { inventoryQuerys, sellerQUerys } from "../querys/apiQuerys.js";
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

    static async getOrderDetails(idPedido) {
        try {
            const pool = await getConnection();

            const result = await pool.request()
                .input("ORDERID", sql.NVarChar, idPedido)
                .query(inventoryQuerys.getOrderDetailsPreview);
            
            return result.recordset;

        } catch (error) {
            console.error("Error al traer la lista de artículos del pedido:", error);
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
            const estadoPedido = await pool.request()
                .input('ORDERID', sql.NVarChar, idPedido)
                .query(inventoryQuerys.getPedido); 

            if(estadoPedido.recordset.length === 0){
                return {
                    ok: false, 
                    message: 'No se encontro el pedido'
                }
            }

           let  estadoPedidoResult = estadoPedido.recordset[0].ESTATUS

            await transaction.begin();
            
            const idConteo = uuidGenerator.nuevoUUID();
            
            const result = await transaction.request()
                .input('PEDIDO', sql.NVarChar, idPedido)
                .input('CONTEO', sql.NVarChar, idConteo)
                .input('ESTADOPED', sql.NVarChar, estadoPedidoResult)
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

            const estadoConteo = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.getConteoById);

            if (estadoConteo.recordset.length > 0 && estadoConteo.recordset[0].ESTADO === 'CERRADO') {
                return {
                    ok: false, 
                    message: 'Acceso denegado: Este conteo ya fue CERRADO y no admite más artículos.'
                };
            }

            const validacion = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .input('VENDEDOR', sql.Int, codVendedor)
                .query(inventoryQuerys.getSellerCount)

            if(validacion.recordset.length === 0){
                return {
                    ok: false, 
                    message: 'Acceso denegado: No te has unido a este conteo. Por favor únete primero.'
                }
            }

            const validacionArticulo = await pool.request()
                .input('CODARTICULO', sql.Int, articuloData.codArticulo)
                .query(inventoryQuerys.checkArticleExists); 

            if(validacionArticulo.recordset.length === 0){
                return {
                    ok: false, 
                    message: `Error: El articulo con codigo: ${articuloData.codArticulo} no existe en la base de datos.`
                }
            }

            const articulosSolicitados = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .input('CODARTICULO', sql.Int, articuloData.codArticulo)
                .query(inventoryQuerys.articlesByOrderLine)

            if(articulosSolicitados.recordset.length === 0){
                return {
                    ok: false, 
                    message: `Atención: El artículo ${articuloData.codArticulo} NO pertenece al pedido original.`
                }
            }

            const tarifaObtenida = articulosSolicitados.recordset[0].IDTARIFAV;
            const precioObtenido = articulosSolicitados.recordset[0].PRECIOUNITARIO;

            const unidadesObtenidas = articulosSolicitados.recordset[0].PRODUCTCOUNT;

            await pool.request()
                .input('IDCONTEO', sql.NVarChar, idConteo)
                .input('CODARTICULO', sql.Int, articuloData.codArticulo)
                .input('TALLA', sql.NVarChar, '.')
                .input('COLOR', sql.NVarChar, '.')
                .input('IDTARIFAV', sql.Int, tarifaObtenida)
                .input('PRECIOUNITARIO', sql.Float, precioObtenido)
                .input('UNIDADES', sql.Int, articuloData.unidades)
                .input('UNIDADESOLICITADAS', sql.Int, unidadesObtenidas)
                .input('CODVENDEDOR', sql.Int, codVendedor)
                .query(inventoryQuerys.insertProductLine);

            await pool.request()
                .input('IDPEDIDO', sql.NVarChar, articuloData.idPedido)
                .input('IDCONTEO', sql.NVarChar, idConteo)
                .input('IDBULTO', sql.NVarChar, articuloData.idBulto)
                .input('NVISUAL', sql.Int, articuloData.nVisual)
                .input('CODARTICULO', sql.Int, articuloData.codArticulo)
                .input('TALLA', sql.NVarChar, '.')
                .input('COLOR', sql.NVarChar, '.')
                .input('IDTARIFAV', sql.Int, tarifaObtenida)
                .input('PRECIOUNITARIO', sql.Float, precioObtenido)
                .input('UNIDADES', sql.Int, articuloData.unidades)
                .query(inventoryQuerys.upsertBultoLine); 

            return {
                ok: true, 
                message: 'Artículo registrado en el global y en el bulto exitosamente'
            };

        }catch(error){
            console.error("Error en el servicio al insertar línea de conteo:", error);
            throw error;
        }
    }

    static async verifyCountDifferences(idConteo) {
        try {
            const pool = await getConnection();

            const comprobacion = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.checkCountDifferences);

            const vendedores = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .query(sellerQUerys.getSellersByCount);

            if (comprobacion.recordset.length === 0) {
                return { 
                    ok: true, 
                    message: 'No se encontraron detalles para este conteo.', 
                    vendedores: vendedores.recordset || [],
                    detalles: []
                };
            }

            const detalles = comprobacion.recordset;
            const conDiferencias = detalles.filter(item => item.DIFERENCIA !== 0);
            
            return {
                ok: true,
                hayDiferencias: conDiferencias.length > 0,
                totalArticulos: detalles.length,
                articulosConError: conDiferencias.length,
                detalles: detalles,
                vendedores: vendedores.recordset 
            };

        } catch (error) {
            console.error("Error al comprobar diferencias del conteo:", error);
            throw error;
        }
    }

    static async closeCount(idConteo, codVendedor, adminPassword) {
        try {
            const pool = await getConnection();

            const validacion = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .input('VENDEDOR', sql.Int, codVendedor)
                .query(inventoryQuerys.getSellerCount);

            if (validacion.recordset.length === 0) {
                return { ok: false, message: 'Acceso denegado: No puedes cerrar un conteo al que no perteneces.' };
            }

            const comprobacion = await pool.request()
                .input('CONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.checkCountDifferences);

            let hayDiferencias = false;
            if (comprobacion.recordset.length > 0) {
                hayDiferencias = comprobacion.recordset.some(item => item.DIFERENCIA !== 0);
            }

            if (hayDiferencias) {
                if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
                    return { 
                        ok: false, 
                        message: 'Hay diferencias en el conteo. Se requiere la clave de administrador correcta para cerrar.' 
                    };
                }
            }

            await pool.request()
                .input('IDCONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.closePedido);

            return {
                ok: true,
                message: hayDiferencias 
                    ? 'Conteo cerrado de forma forzada por el Administrador.'
                    : 'Conteo cerrado exitosamente. ¡Todo cuadra perfectamente!'
            };

        } catch (error) {
            console.error("Error al cerrar el conteo:", error);
            throw error;
        }
    }

    static async createBulto(idPedido, idConteo) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('IDPEDIDO', sql.NVarChar, idPedido)
                .input('IDCONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.createBulto);
            
            // Validaciones de seguridad por si el driver de SQL actúa extraño
            if (result && result.recordset && result.recordset.length > 0) {
                return result.recordset[0];
            } else if (result && result.recordsets && result.recordsets.length > 0) {
                // Si SQL Server lo manda en un arreglo de recordsets múltiple
                const lastRecordset = result.recordsets[result.recordsets.length - 1];
                if (lastRecordset && lastRecordset.length > 0) {
                    return lastRecordset[0];
                }
            }
            
            throw new Error("El bulto se creó, pero SQL Server no devolvió el ID.");

        } catch (error) {
            console.error("Error crítico en createBulto:", error);
            throw error;
        }
    }

    static async getBultos(idConteo) {
        try{
            const pool = await getConnection();

            const result = await pool.request()
                .input('IDCONTEO', sql.NVarChar, idConteo)
                .query(inventoryQuerys.getBultosByConteo);
            
            return result.recordset;
        }catch(error){
            console.error("Error al obtener los bultos:", error);
            throw error;
        }
       
    }

    static async deleteBulto(idConteo, idBulto) {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('IDCONTEO', sql.NVarChar, idConteo)
                .input('IDBULTO', sql.NVarChar, idBulto)
                .query(inventoryQuerys.deleteBulto);
            
            return { ok: true, message: 'Bulto eliminado y respaldado correctamente' };
        } catch (error) {
            console.error("Error al eliminar bulto:", error);
            throw error;
        }
    }

}