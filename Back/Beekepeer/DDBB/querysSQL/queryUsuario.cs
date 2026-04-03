using Beekepeer.Model;

namespace Beekepeer.DDBB.querysSQL
{
    public class queryUsuario
    {
        public const string ListarUsuariosTodos = "SELECT acronimo, clave, nombre, apellido, correo, telefono, localidad_asociada, permiso, activo FROM usuario";

        public const string BuscarPorAcronimo = "SELECT acronimo, clave, nombre, apellido, correo, telefono, localidad_asociada, permiso, activo FROM usuario WHERE acronimo = @Acronimo";

        public const string BuscarUsuarioXIdentificador = @"SELECT* FROM usuario
                            WHERE acronimo = @Identificador OR correo = @Identificador";
        public const string ActualizarUsuario = @"
            UPDATE usuario SET 
                nombre = COALESCE(@Nombre, nombre),
                apellido = COALESCE(@Apellido, apellido), 
                correo = COALESCE(@Correo, correo),
                permiso = COALESCE(@Permiso, permiso),
                telefono = COALESCE(@Telefono, telefono), 
                localidad_asociada = COALESCE(@Localidad_asociada, localidad_asociada), 
                activo = COALESCE(@Activo, activo), 
                clave = COALESCE(@Clave, clave) 
            WHERE acronimo = @Acronimo";

        public const string Eliminar = "DELETE FROM usuario WHERE acronimo = @Acronimo";

        public const string Insertar = @"
            INSERT INTO usuario (acronimo, clave, nombre, apellido, correo, telefono, localidad_asociada, permiso, activo)
            VALUES (@Acronimo, @Clave, @Nombre, @Apellido, @Correo, @Telefono, @Localidad_asociada, @Permiso, @Activo)";
    }
}