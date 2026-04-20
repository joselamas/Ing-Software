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
                                where P.fecha > R.fecha_entrada AND (R.fecha_salida IS NULL OR P.fecha < R.fecha_salida)
                                and usuario_acronimo = @Acronimo";


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



        public const string GetListAlimentacion = @"
                            select CT.colmena_id as idColmena, id_colmena_usuario, CT.fecha as fecha, tipo_suministro, detalle_mezcla, precio_total_insumo, cantidad, observaciones,
                            A.nombre_referencia AS nombre_referencia, A.id as idApiario
                            from control_alimentacion as CT
                            inner join colmena as C on C.id = CT.colmena_id
                            inner join registro_colmena_apiario as R on R.colmena_id = C.id
                            inner join apiario as A on R.apiario_id = A.id
                            where CT.fecha > R.fecha_entrada AND (R.fecha_salida IS NULL OR CT.fecha<R.fecha_salida)
                            and usuario_acronimo = @Acronimo";
                            }
}
