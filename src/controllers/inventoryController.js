import { InventoryService } from "../services/inventoryService.js";

export class InventoryControllers {

    static ordersList = async (req, res) => {
        try{
            
            let { q, page, limit } = req.query; 

            console.log(page, limit)
            
            if(!page || !limit ) {
                page = 1
                limit = 20 
            }

            if(!q) q = null 

            const orders = await InventoryService.getPedidos(q, parseInt(page), parseInt(limit)); 

            res.status(200).json({ ok: true, ...orders })

        } catch (error) {
            console.error("Error al listar los pedidos:", error); 
            res.status(500).json({ ok: false, error: "Error al listar pedidos" });
        }

    }

    static orderDetails = async (req, res) => {
        try {
            let { idPedido } = req.query; 
            
            if (!idPedido) {
                return res.status(400).json({ ok: false, message: "El idPedido es obligatorio en la URL" });
            }

            const detalles = await InventoryService.getOrderDetails(idPedido); 

            res.status(200).json({ ok: true, data: detalles });

        } catch (error) {
            console.error("Error al traer los artículos del pedido:", error); 
            res.status(500).json({ ok: false, error: "Error interno al traer los detalles del pedido" });
        }
    }

    static countsList = async (req, res) => {
        try{
            
            let { q, page, limit } = req.query; 

            console.log(page, limit)
            
            if(!page || !limit ) {
                page = 1
                limit = 20 
            }

            if(!q) q = null 

            const orders = await InventoryService.getCounts(q, parseInt(page), parseInt(limit)); 

            res.status(200).json({ ok: true, ...orders })

        } catch (error) {
            console.error("Error al listar los conteos:", error); 
            res.status(500).json({ ok: false, error: "Error al listar conteos" });
        }

    }
    
    static countListBySeller = async (req, res) => {
        try{
            let {q, page, limit } = req.query; 
            const codVendedor = req.user.codVendedor; 

            console.log(page, limit)

            if(!page || !limit ){
                page = 1
                limit = 20
            }

            if(!q) q = null 

            const counts = await InventoryService.getCountsBySeller(codVendedor, q, parseInt(page), parseInt(limit)); 

            res.status(200).json({ ok: true, ...counts })  

        }catch(error){
            console.error("Error al listar los conteos del vendedor:", error); 
            res.status(500).json({ ok: false, error: "Error al listar conteos del vendedor" });
        }
    }

    static oneOrder = async (req, res) => {
        try{
            let { orderId } = req.query; 
            
            if (!orderId) {
                return res.status(400).json({ ok: false, message: "El orderId es obligatorio en la URL" });
            }

            console.log(orderId); 

            const order = await InventoryService.getPedido(orderId); 

            res.status(200).json({ ok: true, ...order })

        }catch(error){
            console.error("Error al traer el pedido:", error); 
            res.status(500).json({ ok: false, error: "Error al traer el pedido" });
        }
    }

    static oneCount = async (req, res) => {
        try{
            let { idConteo } = req.query; 
            
            if (!idConteo) {
                return res.status(400).json({ ok: false, message: "El idConteo es obligatorio en la URL" });
            }

            console.log(idConteo); 

            const conteo = await InventoryService.getCount(idConteo); 

            const statusCode = conteo.ok ? 200 : 400;
            return res.status(statusCode).json(conteo);

        }catch(error){
            console.error("Error al traer el conteo:", error); 
            res.status(500).json({ ok: false, error: "Error al traer el conteo" });
        }
    }

    static oneCountBySeller = async (req, res) => {
        try{
            let { idConteo } = req.query; 
            const codVendedor = req.user.codVendedor
                
            if (!idConteo) {
                return res.status(400).json({ ok: false, message: "El idConteo es obligatorio en la URL" });
            }

            console.log(idConteo); 

            const conteo = await InventoryService.getCountBySeller(idConteo, codVendedor); 

            const statusCode = conteo.ok ? 200 : 400;
            return res.status(statusCode).json(conteo);

        }catch(error){
            console.error("Error al traer el conteo:", error); 
            res.status(500).json({ ok: false, error: "Error al traer el conteo" });
        }
    }

    static createCount = async (req, res) => {
        try{
            let { idPedido } = req.query; 

            if (!idPedido) {
                return res.status(400).json({ ok: false, message: "El idPedido es obligatorio en la URL" });
            }

            const codVendedor = req.user.codVendedor; 
            const nomVendedor = req.user.nombre; 
            const ipDispositivo = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            console.log("Este es mi dispostivo: ", ipDispositivo)

            const pedido = await InventoryService.getPedido(idPedido); 

            if(!pedido){
                res.status(200).json({ ok: false , message: 'El ID proporcionado no se corresponde con ningun pedido ' })
                return; 
            }

            const checkConteo = await InventoryService.checkCount(idPedido)
        
            if(checkConteo.conteo === true){
                res.status(200).json({ ok: false , message: `Ya existe un conteo creado sobre el pedido ${idPedido}` })
                return; 
            }

            const conteo = await InventoryService.createCount(idPedido, codVendedor, ipDispositivo); 
            console.log(conteo)

            res.status(200).json({ ok: true, message: "Conteo creado exitosamente" })

        }catch(error){
            console.error("Error al crear el conteo:", error); 
            res.status(500).json({ ok: false, error: "Error al crear el conteo" });
        }
    }

    static joinCount = async (req, res) => {
        try{
            let { idConteo } = req.query; 

            if (!idConteo) {
                return res.status(400).json({ ok: false, message: "El idConteo es obligatorio en la URL" });
            }

            const nomVendedor = req.user.nombre; 
            const codVendedor = req.user.codVendedor;
            const ipDispositivo = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const uniserConteo = await InventoryService.joinCount(idConteo, codVendedor, ipDispositivo); 

            //console.log(uniserConteo)

            const statusCode = uniserConteo.ok ? 200 : 400;
            return res.status(statusCode).json(uniserConteo);

        }catch(error){
            console.error("Error al unirse al conteo:", error); 
            res.status(500).json({ ok: false, error: "Error al unirse al conteo" });
        }
    }

    static scanProduct = async (req, res) => {
        try{
            const { idConteo, codArticulo, unidades, unidadesSolicitadas, talla, color, idTarifa, precioUnitario } = req.body; 

            if (!idConteo || !codArticulo || unidades === undefined) {
                return res.status(400).json({ 
                    ok: false, 
                    message: "Faltan datos obligatorios: idConteo, codArticulo y unidades son requeridos." 
                });
            }

            const codVendedor = req.user.codVendedor;

            const articuloData = { codArticulo, unidades, unidadesSolicitadas, talla, color, idTarifa , precioUnitario };

            const resultado = await InventoryService.insertCountLine(idConteo, codVendedor, articuloData);

            if (!resultado.ok) {
                return res.status(403).json(resultado); 
            }

            return res.status(201).json(resultado);

        }catch(error){
            console.error("Error al registrar producto escaneado:", error); 
            return res.status(500).json({ ok: false, error: "Error interno al registrar el producto" });
        }
    }

    static verifyCount = async (req, res) => {
        try {
            const { idConteo } = req.query;
            if (!idConteo) return res.status(400).json({ ok: false, message: "Falta el idConteo" });

            const resultado = await InventoryService.verifyCountDifferences(idConteo);
            res.status(resultado.ok ? 200 : 400).json(resultado);
        } catch (error) {
            res.status(500).json({ ok: false, error: "Error al verificar el conteo" });
        }
    }

    static closeCount = async (req, res) => {
        try {
            const { idConteo, adminPassword } = req.body; 
            
            if (!idConteo) {
                return res.status(400).json({ ok: false, message: "El idConteo es obligatorio" });
            }

            const codVendedor = req.user.codVendedor; 
            
            const resultado = await InventoryService.closeCount(idConteo, codVendedor, adminPassword);
            
            return res.status(resultado.ok ? 200 : 403).json(resultado);
        } catch (error) {
            res.status(500).json({ ok: false, error: "Error al cerrar el conteo" });
        }
    }

    static createNewBulto = async (req, res) => {
        try {
            const { idPedido, idConteo } = req.query;
            const bulto = await InventoryService.createBulto(idPedido, idConteo);
            res.status(200).json({ ok: true, data: bulto });
        } catch (error) { res.status(500).json({ ok: false, message: error.message }); }
    }

    static getBultos = async (req, res) => {
        try {
            const { idConteo } = req.query;
            const bultos = await InventoryService.getBultos(idConteo);
            res.status(200).json({ ok: true, data: bultos });
        } catch (error) { res.status(500).json({ ok: false, message: error.message }); }
    }

}