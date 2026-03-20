import express from 'express';
import cors from 'cors';
import { getConnection } from './config/dbConfig.js';
import articlesRoutes from './routes/articlesRoutes.js' 
import sellersRoutes from './routes/sellersRoutes.js'; 
import inventoryRoutes from './routes/inventoryRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.set('trust proxy', true);

app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'API de Inventarios funcionando' });
});

try {
    console.log("Comprobando conexión a la base de datos...");
    
    await getConnection();
    console.log("Conexión a SQL Server verificada. Iniciando servidor HTTP...");

    app.use("/api/articles", articlesRoutes); 
    app.use("/api/sellers", sellersRoutes); 
    app.use('/api/inventory', inventoryRoutes); 
    
    app.listen(PORT, () => {
        console.log(`Servidor de inventarios corriendo en el puerto ${PORT}`);
    });

} catch (error) {
    console.error("Error crítico: No se pudo conectar a la base de datos. Abortando inicio.");
    console.error(error);
   
    process.exit(1); 
}