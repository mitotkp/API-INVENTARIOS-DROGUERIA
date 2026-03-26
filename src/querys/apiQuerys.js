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
            OR ART.DESCRIPCION LIKE '%' + @BUSQUEDA + '%' 
            OR ART.DESCRIPCION LIKE '%' + @BUSQUEDA + '%'
            OR CAST(ART.CODARTICULO AS VARCHAR) LIKE '%' + @BUSQUEDA + '%')
        ORDER BY
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
        WHERE
            (@BUSQUEDA IS NULL 
            OR ART.DESCRIPCION LIKE '%' + @BUSQUEDA + '%' 
            -- OR ART.DESCRIPCION LIKE '%' + @BUSQUEDA + '%' 
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
            RIP.CABECERA_PED RCP
            INNER JOIN CLIENTES C ON C.CODCLIENTE = RCP.CLIENTEID
        WHERE
            (@BUSQUEDA IS NULL 
            OR RCP.ORDERID  = @BUSQUEDA 
            OR RCP.ORDERID = @BUSQUEDA  
            OR CAST(RCP.ORDERID AS INT) = @BUSQUEDA)
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
            RIP.CABECERA_PED RCP
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
            RIP.LINEA_PED RLP
        WHERE 
            RLP.ORDERID = @ORDERID
    `; 

    static countPedidos = `
        SELECT COUNT(*) AS total 
        FROM RIP.CABECERA_PED RCP
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
            RPC.FECHA 
        FROM 
            RIP.PEDIDOS_CONTEOS RPC
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
            RIP.PEDIDOS_CONTEOS RPC
        WHERE
            (@BUSQUEDA IS NULL 
            OR RPC.IDCONTEO  = @BUSQUEDA 
            OR RPC.IDCONTEO = @BUSQUEDA  
            OR CAST(RPC.IDCONTEO AS NVARCHAR) = @BUSQUEDA)
    `;

    static getConteo = `
        SELECT * FROM RIP.PEDIDOS_CONTEOS WHERE IDPEDIDO = @PEDIDO
    `; 

    static getConteoById = `
        SELECT * FROM RIP.PEDIDOS_CONTEOS WHERE IDCONTEO = @CONTEO
    `; 

    static getConteoBySeller = `
        SELECT 
            RPC.IDPEDIDO, 
            RPC.IDCONTEO,
            RCV.CODVENDEDOR,
            RCV.IPDISPOSITIVO,
            RPC.FECHA 
        FROM 
            RIP.PEDIDOS_CONTEOS RPC
            INNER JOIN RIP.CONTEOS_VENDEDORES RCV ON RPC.IDCONTEO = RCV.IDCONTEO
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
            RCV.CODVENDEDOR,
            RCV.IPDISPOSITIVO,
            RPC.FECHA 
        FROM 
            RIP.PEDIDOS_CONTEOS RPC
            INNER JOIN RIP.CONTEOS_VENDEDORES RCV ON RPC.IDCONTEO = RCV.IDCONTEO
        WHERE
            RCV.CODVENDEDOR = @VENDEDOR
            AND RPC.IDCONTEO = @CONTEO
    `; 

    static countRowsConteosBySeller = `
        SELECT 
           COUNT(*) AS total
       FROM 
           RIP.PEDIDOS_CONTEOS RPC
           INNER JOIN RIP.CONTEOS_VENDEDORES RCV ON RPC.IDCONTEO = RCV.IDCONTEO
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
            RIP.CONTEOSLIN 
        WHERE 
            CODVENDEDOR = @VENDEDOR
            AND IDCONTEO = @CONTEO
    `; 

    static getDetailConteo = `
        SELECT 
	        *
        FROM 
	        RIP.CONTEOSLIN RCL 
        WHERE 
	        RCL.IDCONTEO = @CONTEO
    `; 

    static createPedido = `
        INSERT INTO RIP.PEDIDOS_CONTEOS (IDPEDIDO, IDCONTEO, FECHA)
        VALUES (@PEDIDO, @CONTEO, GETDATE())
    `; 

    static insertSellerCount = `
        INSERT INTO RIP.CONTEOS_VENDEDORES (IDCONTEO, CODVENDEDOR, IPDISPOSITIVO)
        VALUES (@CONTEO, @VENDEDOR, @IP)
    `; 

    static getSellerCount = `
        SELECT 
            * 
        FROM 
            RIP.CONTEOS_VENDEDORES 
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
            RIP.CONTEOS_VENDEDORES RCV
            INNER JOIN RIP.PEDIDOS_CONTEOS RPC ON RCV.IDCONTEO = RPC.IDCONTEO
        WHERE 
            RCV.IDCONTEO = @CONTEO
    `; 

    static insertProductLine = `
        INSERT INTO RIP.CONTEOSLIN 
        (FECHA, CODARTICULO, TALLA, COLOR, HORACONTEO, CODVENDEDOR, UNIDADES, UNIDADESOLICITADAS, IDCONTEO)
        VALUES 
        (CAST(GETDATE() AS DATE), @CODARTICULO, @TALLA, @COLOR, CONVERT(TIME, GETDATE()), @CODVENDEDOR, @UNIDADES, @UNIDADESOLICITADAS,  @IDCONTEO)
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
            , RCL.IDCONTEO
            , RCL.CODARTICULO
            , RCL.TALLA
            , RCL.COLOR
            , RCL.UNIDADES
        FROM 
            RIP.CONTEOSLIN RCL 
            INNER JOIN RIP.PEDIDOS_CONTEOS RPC ON RCL.IDCONTEO = RPC.IDCONTEO
            INNER JOIN RIP.LINEA_PED RLP ON RPC.IDPEDIDO = RLP.ORDERID
        WHERE 
            RCL.IDCONTEO = @CONTEO
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