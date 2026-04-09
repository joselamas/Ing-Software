namespace Beekepeer.DDBB.querysSQL
{
    public class queryColmena_Apiario
    {
        public const string Insertar = @"
                            INSERT INTO registro_colmena_apiario (
                                colmena_id, 
                                apiario_id, 
                                fecha_entrada, 
                                acronimo_usr, 
                                activo       
                            )
                            VALUES (
                                @Colmena_id, 
                                @ApiarioId, 
                                @Fecha_entrada, 
                                @AcronimoUsuario, 
                                1
                            );

                            SELECT @Colmena_id;";

        public const string Apiarios_Colmenas = @"
    SELECT 
        a.id AS apiario_id, 
        a.acronimo_usuario, 
        a.nombre_referencia, 
        a.coordenadas, 
        a.msnm, 
        a.tipo_flora, 
        a.capacidad_maxima, 
        a.fecha_creacion, 
        a.descripcion_acceso,
        a.activo AS apiario_activo,

        c.id , 
        c.id_colmena_usuario, 
        c.tipo_colmena, 
        c.fecha_inicio, 
        c.fecha_inicio_reina, 
        c.es_enjambre, 
        c.id_colmena_madre, 
        c.estado, 
        c.activo AS colmena_activo,
        r.fecha_entrada
    FROM apiario a
    LEFT JOIN registro_colmena_apiario r ON a.id = r.apiario_id 
        AND r.fecha_salida IS NULL 
        AND r.activo = 1
    LEFT JOIN colmena c ON r.colmena_id = c.id
    WHERE a.acronimo_usuario = @Acronimo_usuario 
      AND a.activo = 1
    ORDER BY a.id";
    }
   }
