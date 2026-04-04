namespace Beekepeer.DDBB.querysSQL
{
    public class queryColmena
    {
        public static class queryColmenas
        {
            // Obtener todas las colmenas o filtrar por acrónimo de usuario
            public const string BuscarColmenasXUsusario = @"
        SELECT c.id, c.usuario_acronimo, c.fecha_inicio, c.es_enjambre, c.id_colmena_madre, c.activo, r.apiario_id
        FROM colmena c 
        INNER JOIN registro_colmena_apiario r ON c.id = r.colmena_id
        WHERE (c.usuario_acronimo = @UsuarioAcronimo OR @UsuarioAcronimo IS NULL)
        AND c.activo = 1;";

            // Insertar una nueva colmena
            public const string InsertarColmena = @"
        DECLARE @NuevoID INT;
        INSERT INTO colmena (usuario_acronimo, fecha_inicio, es_enjambre, id_colmena_madre, activo)
        VALUES (@UsuarioAcronimo, @FechaInicio, @EsEnjambre, @IdColmenaMadre, @Activo);
        SET @NuevoID = SCOPE_IDENTITY();
        INSERT INTO registro_colmera_apiario (colmera_id, apiario_id, fecha_entrada)
        VALUES (@NuevoID, (SELECT TOP 1 id FROM apiario WHERE usuario_acronimo = @UsuarioAcronimo AND activo = 1), GETDATE());
        SELECT @NuevoID;"; // Esto devuelve el ID recién creado

            // Actualización dinámica (solo cambia lo que no es null)
            public const string ActualizarColmena = @"
        UPDATE colmena 
        SET 
            usuario_acronimo = COALESCE(@UsuarioAcronimo, usuario_acronimo),
            fecha_inicio = COALESCE(@FechaInicio, fecha_inicio),
            es_enjambre = COALESCE(@EsEnjambre, es_enjambre),
            id_colmena_madre = COALESCE(@IdColmenaMadre, id_colmena_madre),
            activo = COALESCE(@Activo, activo)
        WHERE id = @Id;
        IF @ApiarioId IS NOT NULL
        BEGIN
            DECLARE @ApiarioActual INT;
            SELECT TOP 1 @ApiarioActual = apiario_id 
            FROM registro_colmena_apiario 
            WHERE colmena_id = @Id AND fecha_salida IS NULL 
            ORDER BY fecha_entrada DESC;

            IF @ApiarioActual IS NULL OR @ApiarioActual <> @ApiarioId
                BEGIN
                    UPDATE registro_colmena_apiario 
                    SET fecha_salida = GETDATE() 
                    WHERE colmena_id = @Id AND fecha_salida IS NULL;
                    INSERT INTO registro_colmena_apiario (colmena_id, apiario_id, fecha_ingreso)
                    VALUES (@Id, @ApiarioId, GETDATE());
                END
        END";

            // Borrado lógico (recomendado en lugar de DELETE físico)
            public const string DesactivarColmena = @"
        UPDATE colmena SET activo = 0 WHERE id = @Id";

            // Borrado  DELETE físico Colmena
            public const string BorrarColmena = @"
            DELETE from registro_colmena_apiario WHERE colmena_id = @Id;
            DELETE from colmena WHERE id = @Id;";
        }
    }
}