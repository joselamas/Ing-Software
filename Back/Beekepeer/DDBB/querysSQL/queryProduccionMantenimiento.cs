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

    }
}
