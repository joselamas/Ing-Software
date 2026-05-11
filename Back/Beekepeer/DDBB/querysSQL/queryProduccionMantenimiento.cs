using Beekepeer.Model;

namespace Beekepeer.DDBB.querysSQL
{
    public class queryProduccionMantenimiento
    {
        public const string InsertarProduccion = @"
                                    INSERT INTO produccion_cosecha (
                                        colmena_id, 
                                        fecha, 
                                        tipo_origen,
                                        tipo_producto,
                                        descripcion_flora,
                                        cantidad_kg,
                                        precio_aprox_kg,
                                        fecha_registro_sistema
                                    )
                                    VALUES (
                                        @Colmena_id, 
                                        @Fecha, 
                                        @Tipo_origen, 
                                        @Tipo_producto,
                                        @Descripcion_flora, 
                                        @Cantidad_kg, 
                                        @Precio_aprox_kg,
                                        GETDATE());
                                    SELECT SCOPE_IDENTITY();";

        public const string GetListProduccion = @"
    select id_colmena_usuario, C.id as idColmena, P.fecha, tipo_producto,
      tipo_origen, cantidad_kg, precio_aprox_kg, apiario_id, A.nombre_referencia
    from produccion_cosecha as P
    inner join colmena as C on C.id = P.colmena_id
    inner join registro_colmena_apiario as R on R.colmena_id = C.id
    inner join apiario as A on R.apiario_id = A.id
    where  usuario_acronimo = @Acronimo
    ORDER BY P.fecha DESC, C.id ASC
    OFFSET @Offset ROWS
    FETCH NEXT @Limit ROWS ONLY;";


        public const string InsertarAlimentacion = @"
                                    INSERT INTO control_alimentacion (
                                        colmena_id, 
                                        fecha, 
                                        tipo_suministro,
                                        detalle_mezcla,
                                        cantidad,
                                        precio_total_insumo, 
                                        observaciones,
                                        fecha_registro_sistema
                                    )
                                    VALUES (
                                        @Colmena_id, 
                                        @Fecha, 
                                        @Tipo_suministro, 
                                        @Detalle_mezcla, 
                                        @Cantidad, 
                                        @Precio_total_insumo, 
                                        @Observaciones,
                                        GETDATE()) ; 
                                    SELECT SCOPE_IDENTITY();";



        public const string GetListAlimentacion = @"select CT.colmena_id as idColmena, id_colmena_usuario, CT.fecha as fecha, tipo_suministro, 
                                   detalle_mezcla, precio_total_insumo, cantidad, observaciones,
                                   A.nombre_referencia AS nombre_referencia, A.id as idApiario
                            from control_alimentacion as CT
                            inner join colmena as C on C.id = CT.colmena_id
                            inner join registro_colmena_apiario as R on R.colmena_id = C.id
                            inner join apiario as A on R.apiario_id = A.id
                            where usuario_acronimo = @Acronimo
                              -- Filtro de integridad: Que la alimentación coincida con la estancia en el apiario
                              -- AND CT.fecha >= R.fecha_entrada 
                              -- AND (R.fecha_salida IS NULL OR CT.fecha <= R.fecha_salida)
                            ORDER BY CT.fecha DESC, CT.colmena_id ASC
                            OFFSET @Offset ROWS
                            FETCH NEXT @Limit ROWS ONLY";

        public const string GetProduccionAnual = @"
                    WITH ProduccionAnualCTE AS (
                        SELECT 
                            YEAR(P.fecha) AS Anio,
                            SUM(CASE WHEN P.tipo_producto = 'Miel' THEN P.cantidad_kg ELSE 0 END) AS MielKg,
                            SUM(CASE WHEN P.tipo_producto = 'Polen' THEN P.cantidad_kg ELSE 0 END) AS PolenKg,
                            -- Cálculo de valores (Ajustar multiplicadores según precio de mercado actual)
                            SUM(CASE WHEN P.tipo_producto = 'Miel' THEN P.cantidad_kg * P.precio_aprox_kg ELSE 0 END) AS MielValor,
                            SUM(CASE WHEN P.tipo_producto = 'Polen' THEN P.cantidad_kg * P.precio_aprox_kg ELSE 0 END) AS PolenValor
                        FROM produccion_cosecha AS P
                        INNER JOIN colmena AS C ON P.colmena_id = C.id
                        WHERE C.usuario_acronimo = @Acronimo 
                          AND YEAR(P.fecha) >= YEAR(GETDATE()) - 2
                        GROUP BY YEAR(P.fecha)
                    ),
                    CostosAnualesCTE AS (
                        SELECT 
                            YEAR(A.fecha) AS Anio,
                            -- Cantidades biológicas
                            SUM(CASE WHEN A.tipo_suministro = 'Jarabe' THEN A.cantidad ELSE 0 END) AS JarabeKg,
                            SUM(CASE WHEN A.tipo_suministro <> 'Jarabe' THEN A.cantidad ELSE 0 END) AS TortaKg,
                            -- Valores económicos
                            SUM(CASE WHEN A.tipo_suministro = 'Jarabe' THEN A.precio_total_insumo ELSE 0 END) AS JarabeValor,
                            SUM(CASE WHEN A.tipo_suministro <> 'Jarabe' THEN A.precio_total_insumo ELSE 0 END) AS TortaValor
                        FROM control_alimentacion AS A
                        INNER JOIN colmena AS C ON A.colmena_id = C.id
                        WHERE C.usuario_acronimo = @Acronimo 
                          AND YEAR(A.fecha) >= YEAR(GETDATE()) - 2
                        GROUP BY YEAR(A.fecha)
                    )
                    SELECT 
                        COALESCE(P.Anio, C.Anio) AS Anio,
                        ISNULL(P.MielKg, 0) AS MielKg,
                        ISNULL(C.JarabeKg, 0) AS JarabeKg,
                        ISNULL(P.MielValor, 0) AS MielValor,
                        ISNULL(C.JarabeValor, 0) AS JarabeValor,
                        ISNULL(P.PolenKg, 0) AS PolenKg,
                        ISNULL(C.TortaKg, 0) AS TortaKg,
                        ISNULL(P.PolenValor, 0) AS PolenValor,
                        ISNULL(C.TortaValor, 0) AS TortaValor,
                        -- Relaciones MIEL
                        CAST(CASE WHEN ISNULL(C.JarabeKg, 0) = 0 THEN 0 ELSE (ISNULL(P.MielKg, 0) / C.JarabeKg) END AS FLOAT) AS RelacionNetaMiel,
                        CAST(CASE WHEN ISNULL(C.JarabeValor, 0) = 0 THEN 0 ELSE (ISNULL(P.MielValor, 0) / C.JarabeValor) END AS FLOAT) AS RelacionEconomicaMiel,
                        -- Relaciones POLEN
                        CAST(CASE WHEN ISNULL(C.TortaKg, 0) = 0 THEN 0 ELSE (ISNULL(P.PolenKg, 0) / C.TortaKg) END AS FLOAT) AS RelacionNetaPolen,
                        CAST(CASE WHEN ISNULL(C.TortaValor, 0) = 0 THEN 0 ELSE (ISNULL(P.PolenValor, 0) / C.TortaValor) END AS FLOAT) AS RelacionEconomicaPolen
                    FROM ProduccionAnualCTE P
                    FULL OUTER JOIN CostosAnualesCTE C ON P.Anio = C.Anio
                    ORDER BY Anio DESC";
    }

}
