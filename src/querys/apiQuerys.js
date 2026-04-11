export class ArticlesQuerys  {

    static getArticles = `
        SELECT 
            ART.CODARTICULO
            , ART.REFPROVEEDOR
            , ART.DESCRIPCION
            , ACL.DESCRIPCIONLARGA
            , MC.DESCRIPCION MARCA
            , DPTO.DESCRIPCION DEPARTAMENTO
            , SEC.DESCRIPCION SECCION
            , FAM.DESCRIPCION FAMILIA 
            , SFAM.DESCRIPCION SUBFAMILIA
            , AL.TALLA
            , AL.COLOR
            , AL.CODBARRAS
            , AL.CODBARRAS2
            , AL.CODBARRAS3
            , ACL.CODPROVEDOR
            , ACL.PRINCIPIOACTIVO
            , ST1.STOCK 'STOCK ZAV'
            , ST2.STOCK 'STOCK ZAA'
        FROM 
            ARTICULOS ART 
            INNER JOIN ARTICULOSLIN AL ON ART.CODARTICULO = AL.CODARTICULO
            INNER JOIN ARTICULOSCAMPOSLIBRES ACL ON ART.CODARTICULO = ACL.CODARTICULO
            LEFT JOIN DEPARTAMENTO DPTO ON ART.DPTO = DPTO.NUMDPTO 
            LEFT JOIN SECCIONES SEC ON SEC.NUMDPTO = DPTO.NUMDPTO AND ART.SECCION = SEC.NUMSECCION
            LEFT JOIN FAMILIAS FAM ON FAM.NUMDPTO = DPTO.NUMDPTO AND FAM.NUMSECCION = SEC.NUMSECCION AND ART.FAMILIA = FAM.NUMFAMILIA
            LEFT JOIN SUBFAMILIAS SFAM ON SFAM.NUMDPTO = DPTO.NUMDPTO AND SFAM.NUMSECCION = SEC.NUMSECCION AND SFAM.NUMFAMILIA = FAM.NUMFAMILIA
            AND SFAM.NUMSUBFAMILIA = ART.SUBFAMILIA
            LEFT JOIN MARCA MC ON ART.MARCA = MC.CODMARCA
            LEFT JOIN STOCKS ST1 ON ST1.CODARTICULO = AL.CODARTICULO AND ST1.TALLA = AL.TALLA AND ST1.COLOR = AL.COLOR AND ST1.CODALMACEN LIKE 'ZAV'
            LEFT JOIN STOCKS ST2 ON ST2.CODARTICULO = AL.CODARTICULO AND ST2.TALLA = AL.TALLA AND ST2.COLOR = AL.COLOR AND ST2.CODALMACEN LIKE 'ZAA'
       WHERE
            (@BUSQUEDA IS NULL 
            OR CAST(ART.CODARTICULO AS VARCHAR) = @BUSQUEDA -- Búsqueda exacta de código
            OR AL.CODBARRAS = @BUSQUEDA -- Búsqueda exacta de código de barras
            OR ART.DESCRIPCION LIKE '%' + @BUSQUEDA + '%' 
            OR CAST(ART.CODARTICULO AS VARCHAR) LIKE '%' + @BUSQUEDA + '%')
        ORDER BY
            CASE 
                WHEN CAST(ART.CODARTICULO AS VARCHAR) = @BUSQUEDA THEN 1 -- Prioridad 1: Código exacto
                WHEN AL.CODBARRAS = @BUSQUEDA THEN 2                    -- Prioridad 2: Barras exacto
                WHEN ART.DESCRIPCION LIKE @BUSQUEDA + '%' THEN 3        -- Prioridad 3: Empieza por...
                ELSE 4
            END,
            ART.DESCRIPCION ASC 
        OFFSET @OFFSET ROWS 
        FETCH NEXT @LIMIT ROWS ONLY
    `; 

    static contarArticulos = `
        SELECT 
            COUNT(*) AS total
        FROM 
            ARTICULOS ART 
            INNER JOIN ARTICULOSLIN AL ON ART.CODARTICULO = AL.CODARTICULO
            INNER JOIN ARTICULOSCAMPOSLIBRES ACL ON ART.CODARTICULO = ACL.CODARTICULO
        WHERE (@BUSQUEDA IS NULL 
            OR CAST(ART.CODARTICULO AS VARCHAR) = @BUSQUEDA 
            OR ART.DESCRIPCION LIKE '%' + @BUSQUEDA + '%' 
            OR CAST(ART.CODARTICULO AS VARCHAR) LIKE '%' + @BUSQUEDA + '%')
    `;

    static getDptos = `
        SELECT 
            NUMDPTO
            , DESCRIPCION
        FROM 
            DEPARTAMENTO
    `; 

    static getSections = `
        SELECT 
            NUMDPTO
            , NUMSECCION
            , DESCRIPCION
        FROM 
            SECCIONES
    `;  

    static getFamilies = `
        SELECT 
              NUMDPTO
            , NUMSECCION
            , NUMFAMILIA
            , DESCRIPCION
        FROM 
            FAMILIAS
    `; 

    static getsubFamilies = `
        SELECT 
            NUMDPTO
            , NUMSECCION
            , NUMFAMILIA
            , NUMSUBFAMILIA
            , DESCRIPCION
        FROM 
            SUBFAMILIAS
    `; 

    static getBrand = `
        SELECT 
            CODMARCA
            , DESCRIPCION
        FROM 
            MARCA
    `; 
}

export class  inventoryQuerys {

    static getPedidos = `
        SELECT
            RCP.FECHA
            , RCP.CODVENDEDOR 
            , RCP.ORDERID
            , RCP.CLIENTEID
            , C.NOMBRECLIENTE
            , RCP.ESTATUS
            , RCP.TOTALPRECIO
        FROM 
            DBO.CABECERA_PED RCP
            INNER JOIN CLIENTES C ON C.CODCLIENTE = RCP.CLIENTEID
        WHERE
            (@BUSQUEDA IS NULL 
            OR RCP.ORDERID  = @BUSQUEDA 
            OR RCP.ORDERID = @BUSQUEDA  
            OR CAST(RCP.ORDERID AS INT) = @BUSQUEDA)
            AND RCP.ESTATUS = 'AUTORIZADO' OR RCP.ESTATUS = 'OK'
        ORDER BY
            RCP.ORDERID ASC 
        OFFSET @OFFSET ROWS 
        FETCH NEXT @LIMIT ROWS ONLY
    `;

    static getPedido = `
        SELECT
            RCP.FECHA
            , RCP.CODVENDEDOR 
            , RCP.ORDERID
            , RCP.CLIENTEID
            , C.NOMBRECLIENTE
            , RCP.ESTATUS
            , RCP.TOTALPRECIO
        FROM 
            DBO.CABECERA_PED RCP
            INNER JOIN CLIENTES C ON RCP.CLIENTEID = C.CODCLIENTE
        WHERE
            RCP.ORDERID = @ORDERID
    `; 

    static getDetailPedido = `
        SELECT 
            RLP.LINEAID
            , RLP.ORDERID
            , RLP.CODARTICULO
            , RLP.REFERENCIA
            , RLP.CODALMACEN
            , RLP.IDTARIFAV
            , RLP.PRODUCTCOUNT 
            , RLP.PRECIOUNITARIO
            , RLP.TOTALLINEA
        FROM 
            DBO.LINEA_PED RLP
        WHERE 
            RLP.ORDERID = @ORDERID
    `; 

    static countPedidos = `
        SELECT COUNT(*) AS total 
        FROM DBO.CABECERA_PED RCP
        WHERE
            (@BUSQUEDA IS NULL 
            OR RCP.ORDERID  = @BUSQUEDA 
            -- OR RCP.ORDERID = @BUSQUEDA  
            OR CAST(RCP.ORDERID AS INT) = @BUSQUEDA)
    `; 

    static getConteos = `
        SELECT 
            RPC.IDPEDIDO, 
            RPC.IDCONTEO, 
            RPC.ESTADO, 
            RPC.FECHA 
        FROM 
            DBO.PEDIDOS_CONTEOS RPC
        WHERE
            (@BUSQUEDA IS NULL 
            OR RPC.IDCONTEO  = @BUSQUEDA 
            OR RPC.IDCONTEO = @BUSQUEDA  
            OR CAST(RPC.IDCONTEO AS NVARCHAR) = @BUSQUEDA)
        ORDER BY
            RPC.IDCONTEO ASC 
            OFFSET @OFFSET ROWS 
            FETCH NEXT @LIMIT ROWS ONLY
    `; 

    static countRowsConteos = `
        SELECT 
            COUNT(*) AS total 
        FROM 
            DBO.PEDIDOS_CONTEOS RPC
        WHERE
            (@BUSQUEDA IS NULL 
            OR RPC.IDCONTEO  = @BUSQUEDA 
            OR RPC.IDCONTEO = @BUSQUEDA  
            OR CAST(RPC.IDCONTEO AS NVARCHAR) = @BUSQUEDA)
    `;

    static getConteo = `
        SELECT * FROM DBO.PEDIDOS_CONTEOS WHERE IDPEDIDO = @PEDIDO
    `; 

    static getConteoById = `
        SELECT * FROM DBO.PEDIDOS_CONTEOS WHERE IDCONTEO = @CONTEO
    `; 

    static getConteoBySeller = `
        SELECT 
            RPC.IDPEDIDO, 
            RPC.IDCONTEO,
            RPC.ESTADO,
            RCV.CODVENDEDOR,
            RCV.IPDISPOSITIVO,
            RPC.FECHA 
        FROM 
            DBO.PEDIDOS_CONTEOS RPC
            INNER JOIN DBO.CONTEOS_VENDEDORES RCV ON RPC.IDCONTEO = RCV.IDCONTEO
        WHERE
            RCV.CODVENDEDOR = @VENDEDOR
            AND (@BUSQUEDA IS NULL 
            OR RPC.IDCONTEO  = @BUSQUEDA 
            OR RPC.IDCONTEO = @BUSQUEDA  
            OR CAST(RPC.IDCONTEO AS NVARCHAR) = @BUSQUEDA)
        ORDER BY
            RPC.IDCONTEO ASC 
            OFFSET @OFFSET ROWS 
            FETCH NEXT @LIMIT ROWS ONLY
    `; 

    static getOneConteoBySeller = `
        SELECT 
            RPC.IDPEDIDO, 
            RPC.IDCONTEO,
            RPC.ESTADO,
            RCV.CODVENDEDOR,
            RCV.IPDISPOSITIVO,
            RPC.FECHA 
        FROM 
            DBO.PEDIDOS_CONTEOS RPC
            INNER JOIN DBO.CONTEOS_VENDEDORES RCV ON RPC.IDCONTEO = RCV.IDCONTEO
        WHERE
            RCV.CODVENDEDOR = @VENDEDOR
            AND RPC.IDCONTEO = @CONTEO
    `; 

    static countRowsConteosBySeller = `
        SELECT 
           COUNT(*) AS total
       FROM 
           DBO.PEDIDOS_CONTEOS RPC
           INNER JOIN DBO.CONTEOS_VENDEDORES RCV ON RPC.IDCONTEO = RCV.IDCONTEO
       WHERE
            RCV.CODVENDEDOR = @VENDEDOR
           AND (@BUSQUEDA IS NULL 
           OR RPC.IDCONTEO  = @BUSQUEDA 
           OR RPC.IDCONTEO = @BUSQUEDA  
           OR CAST(RPC.IDCONTEO AS NVARCHAR) = @BUSQUEDA)
    `; 

    static getDetailConteoBySeller = `
        SELECT 
            * 
        FROM 
            DBO.CONTEOSLIN 
        WHERE 
            CODVENDEDOR = @VENDEDOR
            AND IDCONTEO = @CONTEO
    `; 

    static getDetailConteo = `
        SELECT 
	        *
        FROM 
	        DBO.CONTEOSLIN RCL 
        WHERE 
	        RCL.IDCONTEO = @CONTEO
    `; 

    static createPedido = `
        INSERT INTO DBO.PEDIDOS_CONTEOS (IDPEDIDO, IDCONTEO, FECHA, ESTADO, ESTADOPED)
        VALUES (@PEDIDO, @CONTEO, GETDATE(), 'ACTIVO', @ESTADOPED)
    `; 

    static insertSellerCount = `
        INSERT INTO DBO.CONTEOS_VENDEDORES (IDCONTEO, CODVENDEDOR, IPDISPOSITIVO)
        VALUES (@CONTEO, @VENDEDOR, @IP)
    `; 

    static getSellerCount = `
        SELECT 
            * 
        FROM 
            DBO.CONTEOS_VENDEDORES 
        WHERE
            IDCONTEO = @CONTEO 
            AND CODVENDEDOR = @VENDEDOR 
    `;

    static checkPedidoByCount = `
        SELECT 
              RCV.CODVENDEDOR
            , RCV.IDCONTEO
            , RPC.IDPEDIDO
            , RPC.FECHA
        FROM 
            DBO.CONTEOS_VENDEDORES RCV
            INNER JOIN DBO.PEDIDOS_CONTEOS RPC ON RCV.IDCONTEO = RPC.IDCONTEO
        WHERE 
            RCV.IDCONTEO = @CONTEO
    `; 

    static insertProductLine = `
        IF EXISTS (SELECT 1 FROM DBO.CONTEOSLIN WHERE IDCONTEO = @IDCONTEO AND CODARTICULO = @CODARTICULO)
        BEGIN
            UPDATE DBO.CONTEOSLIN
            SET UNIDADES = CASE WHEN (UNIDADES + @UNIDADES) < 0 THEN 0 ELSE (UNIDADES + @UNIDADES) END,
                HORACONTEO = CONVERT(TIME, GETDATE())
            WHERE IDCONTEO = @IDCONTEO AND CODARTICULO = @CODARTICULO;
        END
        ELSE
        BEGIN
            INSERT INTO DBO.CONTEOSLIN 
            (FECHA, CODARTICULO, TALLA, COLOR, HORACONTEO, CODVENDEDOR, UNIDADES, UNIDADESOLICITADAS, IDCONTEO, IDTARIFAV, PRECIOUNITARIO)
            VALUES 
            (CAST(GETDATE() AS DATE), @CODARTICULO, @TALLA, @COLOR, CONVERT(TIME, GETDATE()), @CODVENDEDOR, @UNIDADES, @UNIDADESOLICITADAS,  @IDCONTEO, @IDTARIFAV, @PRECIOUNITARIO)
        END
    `;

    static checkArticleExists = `
        SELECT 
            CODARTICULO 
        FROM 
            ARTICULOS 
        WHERE 
            CODARTICULO = @CODARTICULO
    `; 

    static articlesByOrderLine = `
        SELECT 
            RLP.CODARTICULO
            , RLP.REFERENCIA
            , RLP.CODALMACEN
            , RLP.IDTARIFAV
            , RLP.PRODUCTCOUNT
            , RLP.PRECIOUNITARIO
            , RLP.TOTALLINEA
        FROM 
            DBO.PEDIDOS_CONTEOS RPC
            INNER JOIN DBO.LINEA_PED RLP ON RPC.IDPEDIDO = RLP.ORDERID
        WHERE 
            RPC.IDCONTEO = @CONTEO 
            AND RLP.CODARTICULO = @CODARTICULO
    `; 

    static checkCountDifferences = `
        SELECT 
            RLP.CODARTICULO,
            ART.DESCRIPCION,
            RLP.PRODUCTCOUNT AS SOLICITADAS,
            ISNULL(SUM(RCL.UNIDADES), 0) AS CONTADAS,
            (ISNULL(SUM(RCL.UNIDADES), 0) - RLP.PRODUCTCOUNT) AS DIFERENCIA,
            -- NUEVA LÓGICA: Trae un texto plano separado por comas con el desglose de bultos
            STUFF((
                SELECT ', Bulto ' + CAST(B.NVISUAL AS VARCHAR) + ' (' + CAST(B.UNIDADES AS VARCHAR) + ')'
                FROM DBO.BULTOS_CONTEO B
                WHERE B.IDCONTEO = @CONTEO AND B.CODARTICULO = RLP.CODARTICULO AND B.UNIDADES > 0
                ORDER BY B.NVISUAL ASC
                FOR XML PATH('')
            ), 1, 2, '') AS DETALLE_BULTOS
        FROM 
            DBO.PEDIDOS_CONTEOS RPC
            INNER JOIN DBO.LINEA_PED RLP ON RPC.IDPEDIDO = RLP.ORDERID
            LEFT JOIN ARTICULOS ART ON RLP.CODARTICULO = ART.CODARTICULO
            LEFT JOIN DBO.BULTOS_CONTEO RCL ON RPC.IDCONTEO = RCL.IDCONTEO AND RLP.CODARTICULO = RCL.CODARTICULO
        WHERE 
            RPC.IDCONTEO = @CONTEO
        GROUP BY 
            RLP.CODARTICULO, ART.DESCRIPCION, RLP.PRODUCTCOUNT
    `;

    static closePedido = `
        UPDATE DBO.PEDIDOS_CONTEOS 
        SET ESTADO = 'CERRADO' 
        WHERE IDCONTEO = @CONTEO
    `;

    static closePedCab = `
        UPDATE DBO.CABECERA_PED
        SET ESTADO = 'EMBALADO'
        WHERE IDPEDIO = @PEDIDO
    `; 

    static getOrderDetailsPreview = `
        SELECT 
            RLP.CODARTICULO,
            ART.DESCRIPCION,
            RLP.PRODUCTCOUNT AS SOLICITADAS
        FROM 
            DBO.LINEA_PED RLP
            LEFT JOIN ARTICULOS ART ON RLP.CODARTICULO = ART.CODARTICULO
        WHERE 
            RLP.ORDERID = @ORDERID
    `;

    static createBulto = `
        SET NOCOUNT ON;
                
        DECLARE @NextNum INT;
        SELECT @NextNum = ISNULL(MAX(TRY_CAST(REPLACE(IDBULTO, 'BULTO-', '') AS INT)), 0) + 1 
        FROM DBO.BULTOS_CONTEO WHERE IDBULTO LIKE 'BULTO-%';
        
        DECLARE @NextId VARCHAR(20) = 'BULTO-' + CAST(ISNULL(@NextNum, 1) AS VARCHAR);
        
        DECLARE @VisualNum INT;
        SELECT @VisualNum = ISNULL(MAX(NVISUAL), 0) + 1 
        FROM DBO.BULTOS_CONTEO WHERE IDCONTEO = @IDCONTEO;

        DECLARE @OutputTable TABLE (IDBULTO VARCHAR(20), NVISUAL INT);

        INSERT INTO DBO.BULTOS_CONTEO (IDPEDIDO, IDCONTEO, IDBULTO, NVISUAL)
        OUTPUT INSERTED.IDBULTO, INSERTED.NVISUAL INTO @OutputTable
        VALUES (@IDPEDIDO, @IDCONTEO, @NextId, @VisualNum);

        SELECT TOP 1 IDBULTO, NVISUAL FROM @OutputTable;
    `;

    static getBultosByConteo = `
        SELECT DISTINCT IDBULTO, NVISUAL
        FROM DBO.BULTOS_CONTEO
        WHERE IDCONTEO = @IDCONTEO
        ORDER BY NVISUAL ASC;
    `;

    static upsertBultoLine = `
        IF EXISTS (SELECT 1 FROM DBO.BULTOS_CONTEO WHERE IDCONTEO = @IDCONTEO AND IDBULTO = @IDBULTO AND CODARTICULO IS NULL)
        BEGIN
            UPDATE DBO.BULTOS_CONTEO
            SET CODARTICULO = @CODARTICULO, TALLA = @TALLA, COLOR = @COLOR, IDTARIFAV = @IDTARIFAV, PRECIOUNITARIO = @PRECIOUNITARIO, UNIDADES = @UNIDADES
            WHERE IDCONTEO = @IDCONTEO AND IDBULTO = @IDBULTO AND CODARTICULO IS NULL;
        END
        ELSE IF EXISTS (SELECT 1 FROM DBO.BULTOS_CONTEO WHERE IDCONTEO = @IDCONTEO AND IDBULTO = @IDBULTO AND CODARTICULO = @CODARTICULO)
        BEGIN
            UPDATE DBO.BULTOS_CONTEO
            SET UNIDADES = CASE WHEN (UNIDADES + @UNIDADES) < 0 THEN 0 ELSE (UNIDADES + @UNIDADES) END
            WHERE IDCONTEO = @IDCONTEO AND IDBULTO = @IDBULTO AND CODARTICULO = @CODARTICULO;
        END
        ELSE
        BEGIN
            INSERT INTO DBO.BULTOS_CONTEO (IDPEDIDO, IDCONTEO, IDBULTO, NVISUAL, CODARTICULO, TALLA, COLOR, IDTARIFAV, PRECIOUNITARIO, UNIDADES)
            VALUES (@IDPEDIDO, @IDCONTEO, @IDBULTO, @NVISUAL, @CODARTICULO, @TALLA, @COLOR, @IDTARIFAV, @PRECIOUNITARIO, @UNIDADES);
        END
    `;
}

export class sellerQUerys {

    static getSellers = `
        SELECT 
            CODVENDEDOR
            , NOMVENDEDOR
            , DIRECCION
            , POBLACION
            , PROVINCIA
            , TELEFONO
            , ACTIVO
            , BLOQUEADO
        FROM 
            VENDEDORES
    `; 

    static getSeller = `
         SELECT 
            CODVENDEDOR
            , NOMVENDEDOR
            , DIRECCION
            , POBLACION
            , PROVINCIA
            , TELEFONO
            , ACTIVO
            , BLOQUEADO
            , NEWPASSENTRADA
            , NEWPASSREGISTRO
        FROM 
            VENDEDORES
        WHERE
            NEWPASSENTRADA = @PASSENTRADA
    `; 

    static getSellersByCount = `
        SELECT DISTINCT
            CV.CODVENDEDOR,
            V.NOMVENDEDOR
        FROM 
            DBO.CONTEOS_VENDEDORES CV
            LEFT JOIN VENDEDORES V ON CV.CODVENDEDOR = V.CODVENDEDOR
        WHERE 
            CV.IDCONTEO = @CONTEO
    `;

    static insertToken = `
        INSERT INTO ACCESOS_DROGUERIA (CODVENDEDOR, TOKEN, ACTIVO)
        VALUES (@CODVENDEDOR, @TOKEN, 'T')
    `;

    static invalidToken = `
        UPDATE ACCESOS_DROGUERIA SET ACTIVO = 'F' WHERE TOKEN = @TOKEN 
        AND ACTIVO = 'T'
    `

    static cleansToken = `
        UPDATE ACCESOS_DROGUERIA SET ACTIVO = 'F'
        WHERE CODVENDEDOR = @CODVENDEDOR AND ACTIVO = 'T' 
        AND FECHA <= DATEADD(HOUR, -12, GETDATE())
    `;

}