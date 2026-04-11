namespace Beekepeer.DDBB.querysSQL
{
        public static class queryColmena
        {

        public const string ObtenerColmenasConUbicacion = @"
                    SELECT 
                        c.id,
                        c.id_colmena_usuario,
                        c.tipo_colmena,
                        c.estado,
                        c.fecha_inicio,
                        c.es_enjambre,
                        c.id_colmena_madre,
                        c.fecha_inicio_reina,
                        c.activo,
                        a.msnm,
                        a.id AS apiario_id,
                        a.nombre_referencia AS nombre_apiario,
                        ra.fecha_entrada as fecha_entradaApiario
                    FROM colmena c
                    INNER JOIN registro_colmena_apiario ra ON c.id = ra.colmena_id
                    INNER JOIN apiario a ON ra.apiario_id = a.id
                    WHERE c.usuario_acronimo = @UsuarioAcronimo 
                      AND ra.fecha_salida IS NULL 
                      AND ra.activo = 1;";

        public const string ObtenerColmenaIDs = @"SELECT 
                        id,
                        id_colmena_usuario
                    FROM colmena 
                    WHERE usuario_acronimo = @UsuarioAcronimo";

        // Insertar una nueva colmena
        public const string InsertarColmena = @"
                                    DECLARE @NuevoID INT;

                                    INSERT INTO colmena (
                                        usuario_acronimo, 
                                        id_colmena_usuario, 
                                        fecha_inicio, 
                                        es_enjambre, 
                                        id_colmena_madre, 
                                        activo, 
                                        tipo_colmena, 
                                        fecha_inicio_reina, 
                                        estado
                                    )
                                    VALUES (
                                        @UsuarioAcronimo, 
                                        @Id_colmena_usuario, 
                                        @FechaInicio, 
                                        @EsEnjambre, 
                                        @IdColmenaMadre, 
                                        @Activo, 
                                        @Tipo_colmena, 
                                        @Fecha_inicio_reina,
                                        @Estado
                                    );

                                    -- ASIGNACIÓN CRÍTICA: Capturamos el ID generado
                                    SET @NuevoID = SCOPE_IDENTITY();

                                    -- Devolvemos el valor para que ExecuteScalar lo reciba
                                    SELECT @NuevoID;";


        // Obtener todas las colmenas o filtrar por acrónimo de usuario
        public const string BuscarColmenasXUsusario = @"
                SELECT c.id, c.usuario_acronimo, c.fecha_inicio, c.es_enjambre, c.id_colmena_madre, c.activo,
                FROM colmena c 
                INNER JOIN registro_colmena_apiario r ON c.id = r.colmena_id
                WHERE (c.usuario_acronimo = @UsuarioAcronimo OR @UsuarioAcronimo IS NULL)
                AND c.activo = 1;";
            
        
        // Actualización dinámica (solo cambia lo que no es null)


        public const string ActualizarColmena = @"  UPDATE colmena SET 
                                                        usuario_acronimo   = COALESCE(@UsuarioAcronimo, usuario_acronimo),
                                                        fecha_inicio       = COALESCE(@FechaInicio, fecha_inicio),
                                                        es_enjambre        = COALESCE(@EsEnjambre, es_enjambre),
                                                        id_colmena_madre   = COALESCE(@IdColmenaMadre, id_colmena_madre),
                                                        activo             = COALESCE(@Activo, activo),
                                                        tipo_colmena       = COALESCE(@TipoColmena, tipo_colmena),
                                                        fecha_inicio_reina = COALESCE(@FechaInicioReina, fecha_inicio_reina),
                                                        estado             = COALESCE(@Estado, estado),
                                                        id_colmena_usuario = COALESCE(@IdColmenaUsuario, id_colmena_usuario)
                                                    WHERE id = @Id;

                                                    -- 2. Lógica de Traslado de Apiario (Historial)
                                                    IF @ApiarioId IS NOT NULL
                                                    BEGIN
                                                        DECLARE @ApiarioActual INT;
    
                                                        -- Buscamos si la colmena ya está en un apiario actualmente
                                                        SELECT TOP 1 @ApiarioActual = apiario_id 
                                                        FROM registro_colmena_apiario 
                                                        WHERE colmena_id = @Id AND fecha_salida IS NULL 
                                                        ORDER BY fecha_entrada DESC;

                                                        -- Si el apiario cambió o no tenía uno asignado, movemos la colmena
                                                        IF @ApiarioActual IS NULL OR @ApiarioActual <> @ApiarioId
                                                        BEGIN
                                                            -- Cerramos el registro en el apiario anterior
                                                            UPDATE registro_colmena_apiario 
                                                            SET fecha_salida = GETDATE(),
                                                                activo = 0 -- Opcional: marcar como inactivo el registro viejo
                                                            WHERE colmena_id = @Id AND fecha_salida IS NULL;

                                                            -- Creamos la entrada en el nuevo apiario
                                                            INSERT INTO registro_colmena_apiario (colmena_id, apiario_id, fecha_entrada, activo)
                                                            VALUES (@Id, @ApiarioId, GETDATE(), 1);
                                                        END
                                                    END";

            // Borrado lógico (recomendado en lugar de DELETE físico)
            // Al desactivar una colmena también cerramos su registro activo en registro_colmena_apiario
            public const string DesactivarColmena = @"
        UPDATE colmena SET activo = 0 WHERE id = @Id;

        UPDATE registro_colmena_apiario
        SET activo = 0
        WHERE colmena_id = @Id;";

            // Borrado  DELETE físico Colmena
            public const string BorrarColmena = @"
            DELETE from registro_colmena_apiario WHERE colmena_id = @Id;
            DELETE from colmena WHERE id = @Id;";
        }
    }
