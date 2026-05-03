namespace Beekepeer.DDBB.querysSQL
{
    public static class queryEstadisticas
    {
        // Esta consulta consolida contadores clave del usuario en una sola ejecución
        public const string ResumenGeneral = @"
            SELECT 
                (SELECT COUNT(*) FROM apiario WHERE acronimo_usuario = @Acronimo AND activo = 1) as TotalApiarios,
                (SELECT COUNT(*) FROM colmena WHERE usuario_acronimo = @Acronimo AND activo = 1) as TotalColmenas,
                (SELECT ISNULL(SUM(p.cantidad_kg), 0) FROM produccion_cosecha p 
                 INNER JOIN colmena c ON p.colmena_id = c.id 
                 WHERE c.usuario_acronimo = @Acronimo) as TotalMielKg,
                (SELECT ISNULL(SUM(al.precio_total_insumo), 0) FROM control_alimentacion al 
                 INNER JOIN colmena c ON al.colmena_id = c.id 
                 WHERE c.usuario_acronimo = @Acronimo) as TotalInversion;";

        public const string ObtenerTotalesYRoi = @"
            SELECT 
                ISNULL(SUM(CASE WHEN p.tipo_producto = 'Miel' THEN CAST(p.cantidad_kg AS FLOAT) ELSE 0 END), 0) as TotalMiel,
                ISNULL(SUM(CASE WHEN p.tipo_producto = 'Polen' THEN CAST(p.cantidad_kg AS FLOAT) ELSE 0 END), 0) as TotalPolen,
                ISNULL(SUM(CAST(p.cantidad_kg AS DECIMAL(18,2)) * CAST(p.precio_aprox_kg AS DECIMAL(18,2))), 0) as Ingresos,
                (SELECT ISNULL(SUM(precio_total_insumo), 0) FROM control_alimentacion al 
                 INNER JOIN colmena c2 ON al.colmena_id = c2.id WHERE c2.usuario_acronimo = @Acronimo) as Egresos,
                (SELECT ISNULL(SUM(CASE WHEN al2.tipo_suministro IN ('Jarabe', 'Líquido') THEN al2.cantidad ELSE 0 END), 0) 
                 FROM control_alimentacion al2 INNER JOIN colmena c3 ON al2.colmena_id = c3.id WHERE c3.usuario_acronimo = @Acronimo) as TotalLiquido,
                (SELECT ISNULL(SUM(CASE WHEN al3.tipo_suministro NOT IN ('Jarabe', 'Líquido') THEN al3.cantidad ELSE 0 END), 0) 
                 FROM control_alimentacion al3 INNER JOIN colmena c4 ON al3.colmena_id = c4.id WHERE c4.usuario_acronimo = @Acronimo) as TotalSolido
            FROM produccion_cosecha p
            INNER JOIN colmena c ON p.colmena_id = c.id
            WHERE c.usuario_acronimo = @Acronimo;";

        public const string ObtenerTendenciaMensual = @"
            SELECT Mes, MesNum, 
                   SUM(Miel) as Miel, SUM(Polen) as Polen, 
                   SUM(Liquido) as Liquido, SUM(Solido) as Solido
            FROM (
                SELECT 
                    FORMAT(fecha, 'MMM', 'es-ES') as Mes,
                    MONTH(fecha) as MesNum,
                    SUM(CASE WHEN tipo_producto = 'Miel' THEN cantidad_kg ELSE 0 END) as Miel,
                    SUM(CASE WHEN tipo_producto = 'Polen' THEN cantidad_kg ELSE 0 END) as Polen,
                    0 as Liquido, 0 as Solido
                FROM produccion_cosecha p
                INNER JOIN colmena c ON p.colmena_id = c.id
                WHERE c.usuario_acronimo = @Acronimo AND fecha >= DATEADD(MONTH, -12, GETDATE())
                GROUP BY FORMAT(fecha, 'MMM', 'es-ES'), MONTH(fecha)
                UNION ALL
                SELECT 
                    FORMAT(fecha, 'MMM', 'es-ES') as Mes,
                    MONTH(fecha) as MesNum,
                    0 as Miel, 0 as Polen,
                    SUM(CASE WHEN tipo_suministro IN ('Jarabe', 'Líquido') THEN cantidad ELSE 0 END) as Liquido,
                    SUM(CASE WHEN tipo_suministro NOT IN ('Jarabe', 'Líquido') THEN cantidad ELSE 0 END) as Solido
                FROM control_alimentacion al
                INNER JOIN colmena c ON al.colmena_id = c.id
                WHERE c.usuario_acronimo = @Acronimo AND fecha >= DATEADD(MONTH, -12, GETDATE())
                GROUP BY FORMAT(fecha, 'MMM', 'es-ES'), MONTH(fecha)
            ) as Combined
            GROUP BY Mes, MesNum
            ORDER BY MesNum;";

        public const string ObtenerRankingElite = @"
            SELECT TOP 50
                c.id_colmena_usuario as Id_colmena,
                a.nombre_referencia as Apiario,
                a.msnm,
                c.fecha_inicio as FechaInicio,
                SUM(p.cantidad_kg) as Produccion
            FROM colmena c
            INNER JOIN registro_colmena_apiario ac ON c.id = ac.colmena_id
            INNER JOIN apiario a ON ac.apiario_id = a.id
            LEFT JOIN produccion_cosecha p ON c.id = p.colmena_id
            WHERE c.usuario_acronimo = @Acronimo AND c.activo = 1
            GROUP BY c.id_colmena_usuario, a.nombre_referencia, a.msnm, c.fecha_inicio
            ORDER BY Produccion DESC;";



        public const string ObtenerRendimientos = @"SELECT 
                a.nombre_referencia AS Apiario,
                pc.tipo_producto AS Producto,
                YEAR(pc.fecha) AS Anio,
                MONTH(pc.fecha) AS Mes,
                FORMAT(pc.fecha, 'yyyy-MM') AS Periodo,
                SUM(pc.cantidad_kg) AS Total_Kg,
                SUM(pc.cantidad_kg) / NULLIF(COUNT(DISTINCT c.id), 0) AS Rendimiento_Promedio_Mes
            FROM apiario a
            JOIN registro_colmena_apiario rca ON a.id = rca.apiario_id
            JOIN colmena c ON rca.colmena_id = c.id
            JOIN produccion_cosecha pc ON c.id = pc.colmena_id
            WHERE a.acronimo_usuario = @acronimo  -- Filtro de seguridad por usuario
              AND rca.fecha_salida IS NULL        -- Solo colmenas actualmente en el apiario
              AND a.activo = 1
            GROUP BY 
                a.nombre_referencia, 
                pc.tipo_producto, 
                YEAR(pc.fecha), 
                MONTH(pc.fecha),
                FORMAT(pc.fecha, 'yyyy-MM')
            ORDER BY 
                Anio DESC, 
                Mes DESC, 
                Apiario;";
}
}