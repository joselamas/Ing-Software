using Beekepeer.Model;
using System.Data.SqlClient;
using Beekepeer.DDBB.querysSQL;
using System;

namespace Beekepeer.DDBB
{
    public class UsuarioConsultas
    {
        private readonly string _sqlurl;

        public UsuarioConsultas(string configuration)
        {
            _sqlurl = configuration;
        }

     
        // 1. BUSCAR POR acronimo
        public Usuario? BuscarUsuarioXAcronimo(string _acronimo)
        {
            Usuario? usr = null;

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryUsuario.BuscarPorAcronimo, connection);
                cmd.Parameters.AddWithValue("@Acronimo", _acronimo);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        usr = new Usuario
                        {
                            nombre = reader["nombre"].ToString() ?? "",
                            clave = reader["clave"].ToString() ?? "",
                            apellido = reader["apellido"].ToString() ?? "",
                            correo = reader["correo"].ToString() ?? "",
                            telefono = reader["telefono"].ToString() ?? "",
                            permiso = (int)reader["permiso"],
                            localidad_asociada = reader["localidad_asociada"].ToString() ?? "",
                            activo = reader["activo"] != DBNull.Value && (bool)reader["activo"],
                            acronimo = _acronimo
                        };
                    }
                }
            }
            return usr;
        }

        // 2. BÚSQUEDA completa de usuarios
        public List<Usuario> GetTodosLosUsuarios()
        {
            List<Usuario> listUsr = new List<Usuario>();
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryUsuario.ListarUsuariosTodos, connection);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        listUsr.Add(new Usuario
                        {
                            acronimo = reader["acronimo"].ToString() ?? "",
                            nombre = reader["nombre"].ToString() ?? "",
                            clave = reader["clave"].ToString() ?? "",
                            apellido = reader["apellido"].ToString() ?? "",
                            correo = reader["correo"].ToString() ?? "",
                            telefono = reader["telefono"].ToString() ?? "",
                            permiso = (int)reader["permiso"],
                            localidad_asociada = reader["localidad_asociada"].ToString() ?? "",
                            activo = reader["activo"] != DBNull.Value && (bool)reader["activo"],
                        });
                    }
                }
            }

            return listUsr;

        }

        // 3. ACTUALIZAR usuario
        public bool ActualizarUsuario(string acronimo, int? permiso, string? nombre, string? apellido, string? correo, string? clave, string? telefono, string? localidad_asociada, bool? activo)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryUsuario.ActualizarUsuario, connection);

                // Esta lógica permite que si el parámetro es null, se envíe DBNull a SQL
                cmd.Parameters.AddWithValue("@Acronimo", acronimo);
                cmd.Parameters.AddWithValue("@Permiso", (object)permiso ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Nombre", (object)nombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Apellido", (object)apellido ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Correo", (object)correo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Clave", (object)clave ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Telefono", (object)telefono ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Activo", (object)activo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Localidad_asociada", (object)localidad_asociada ?? DBNull.Value);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 4. ELIMINAR POR acronimo
        public bool EliminarUsuarioxAcronimo(string acronimo)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryUsuario.Eliminar, connection);
                cmd.Parameters.AddWithValue("@Acronimo", acronimo);
                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 5. INSERTAR
        public bool InsertarUsuario(string acronimo ,int permiso, string nombre, string apellido, string correo, string clave, string telefono, string localidad_asociada, bool activo)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryUsuario.Insertar, connection);
                cmd.Parameters.AddWithValue("@Acronimo", acronimo);
                cmd.Parameters.AddWithValue("@Permiso", permiso);
                cmd.Parameters.AddWithValue("@Nombre", nombre);
                cmd.Parameters.AddWithValue("@Apellido", apellido);
                cmd.Parameters.AddWithValue("@Correo", correo);
                cmd.Parameters.AddWithValue("@Clave", clave);
                cmd.Parameters.AddWithValue("@Telefono", telefono);
                cmd.Parameters.AddWithValue("@Activo", activo);
                cmd.Parameters.AddWithValue("@Localidad_asociada", localidad_asociada);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
        
    }
}