namespace Beekepeer.DDBB.querysSQL
{
    public static class queryApiario
    {
        // 1. Obtener todos los apiarios o filtrar por usuario
        public const string ListarApiarios = @"
            SELECT id, acronimo_usuario, nombre_referencia, coordenadas, msnm, activo 
            FROM apiario 
            WHERE acronimo_usuario = @AcronimoUsuario OR @AcronimoUsuario IS NULL";

        // 2. Buscar un apiario específico por su Usuario
        public const string BuscarPorId = @"
            SELECT id, acronimo_usuario, nombre_referencia, coordenadas, msnm, activo 
            FROM apiario 
            WHERE id = @Id";

        // 3. Insertar un nuevo apiario
        public const string InsertarApiario = @"
            INSERT INTO apiario (acronimo_usuario, nombre_referencia, coordenadas, msnm, activo)
            VALUES (@AcronimoUsuario, @NombreReferencia, @Coordenadas, @Msnm, @Activo);
            SELECT SCOPE_IDENTITY();";

        // 4. Actualización dinámica (solo lo que no sea null)
        public const string ActualizarApiario = @"
            UPDATE apiario 
            SET 
                acronimo_usuario = COALESCE(@AcronimoUsuario, acronimo_usuario),
                nombre_referencia = COALESCE(@NombreReferencia, nombre_referencia),
                coordenadas = COALESCE(@Coordenadas, coordenadas),
                msnm = COALESCE(@Msnm, msnm),
                activo = COALESCE(@Activo, activo)
            WHERE id = @Id";

        // 5. Borrado Lógico (Desactivar)
        public const string DesactivarApiario = @"
            UPDATE apiario SET activo = 0 WHERE id = @Id";

        // 6. Borrado Físico
        public const string EliminarApiario = @"
            DELETE FROM apiario WHERE id = @Id";
    }
}