namespace Beekepeer.DDBB.querysSQL
{
    public class queryColmena
    {
        public static class queryColmenas
        {
            // Obtener todas las colmenas o filtrar por acrónimo de usuario
            public const string BuscarColmenasXUsusario = @"
        SELECT id, usuario_acronimo, fecha_inicio, es_enjambre, id_colmena_madre, activo 
        FROM colmena 
        WHERE usuario_acronimo = @UsuarioAcronimo OR @UsuarioAcronimo IS NULL";

            // Insertar una nueva colmena
            public const string InsertarColmena = @"
        INSERT INTO colmena (usuario_acronimo, fecha_inicio, es_enjambre, id_colmena_madre, activo)
        VALUES (@UsuarioAcronimo, @FechaInicio, @EsEnjambre, @IdColmenaMadre, @Activo);
        SELECT SCOPE_IDENTITY();"; // Esto devuelve el ID recién creado

            // Actualización dinámica (solo cambia lo que no es null)
            public const string ActualizarColmena = @"
        UPDATE colmena 
        SET 
            usuario_acronimo = COALESCE(@UsuarioAcronimo, usuario_acronimo),
            fecha_inicio = COALESCE(@FechaInicio, fecha_inicio),
            es_enjambre = COALESCE(@EsEnjambre, es_enjambre),
            id_colmena_madre = COALESCE(@IdColmenaMadre, id_colmena_madre),
            activo = COALESCE(@Activo, activo)
        WHERE id = @Id";

            // Borrado lógico (recomendado en lugar de DELETE físico)
            public const string DesactivarColmena = @"
        UPDATE colmena SET activo = 0 WHERE id = @Id";

            // Borrado  DELETE físico Colmena
            public const string BorrarColmena = @"
        DELETE from colmena WHERE id = @Id";
        }
    }
}