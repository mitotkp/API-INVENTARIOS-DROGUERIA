import { SellersService } from "../services/sellersService.js";

export class SellersControllers {

    static async login(req, res) {
        try {
            const { password } = req.body; 

            if(!password) {
                return res.status(400).json({
                    ok: false, 
                    menssage: "Faltan credenciales"
                }); 
            }

            const data = await SellersService.loginSeller(password); 

            return res.status(200).json({
                ok: true, 
                menssage: "Login exitoso",
                ...data
            }); 
        }
        catch (error) {

            const statusCode = error.message.includes("incorrectos") ? 400 : 500;

            return res.status(401).json({ 
                success: false, 
                message: error.message 
            });
        }
    }

    static async logout(req, res) {
        try {

            const authHeader = req.headers['authorization']; 

            if (!authHeader) {
                return res.status(400).json(
                    {
                        ok: false, 
                        message: "No se proporciono token"
                    }
                ); 
            }

            const token = authHeader.split(' ')[1]; 

            await SellersService.logoutSeller(token); 

            return res.status(200).json({
                ok: true, 
                message: "Sesión cerrada exitosamente en el servidor"
            }); 
        }
        catch (error) {
            return res.status(500).json({ 
                ok: false, 
                message: "Error al procesar el cierre de sesión" 
            });
        }
    }   

    static async getSellers(req, res) {
        try{

            const sellers = await SellersService.getSellers(); 

            res.status(200).json({ ok: true, ...sellers});

        }catch(error){
            console.error("Error al listar los vendedores:", error);
            res.status(500).json({ ok: false, error: "Error al listar los vendedores" }); 
        }
    }

}