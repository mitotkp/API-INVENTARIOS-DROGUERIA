import jwt from 'jsonwebtoken';
import { getConnection, sql } from '../config/dbConfig.js';

export const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                ok: false, 
                message: "Acceso denegado. No se proporcionó un token válido." 
            });
        }

        const token = authHeader.split(' ')[1];

        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);

        const pool = await getConnection();
        const result = await pool.request()
            .input('TOKEN', sql.VarChar, token)
            .query(`
                SELECT ACTIVO
                FROM ACCESOS_DROGUERIA
                WHERE TOKEN = @TOKEN
            `);

        if (result.recordset.length === 0 || result.recordset[0].Activo === 'F') {
            return res.status(401).json({ 
                ok: false, 
                message: "Sesión inválida o cerrada. Por favor, inicie sesión nuevamente." 
            });
        }
        req.user = decoded;

        next();

    } catch (error) {
        console.error("ERROR REAL EN EL MIDDLEWARE:", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ ok: false, message: "El token ha expirado por tiempo." });
        }
        
        return res.status(401).json({ ok: false, message: "Token inválido o corrupto." });
    }
};