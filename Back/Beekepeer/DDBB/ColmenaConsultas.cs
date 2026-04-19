using Beekepeer.Model;
using System.Data.SqlClient;
using Beekepeer.DDBB.querysSQL;
using Beekepeer.Model.ws;

namespace Beekepeer.DDBB
{
    public class ColmenaConsultas
    {
        private readonly string _sqlurl;

        public ColmenaConsultas(string configuration)
        {
            _sqlurl = configuration;
        }

        // 1. BUSCAR COLMENAS POR USUARIO (O TODAS)
        public List<ColmenaWS> GetLisColmenas(string? usuarioAcronimo = null)
        {
            List<ColmenaWS> lista = new List<ColmenaWS>();

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena.ObtenerColmenasConUbicacion, connection);
                // Manejo de parámetro nulo para que sea compatible con el WHERE de SQL
                cmd.Parameters.AddWithValue("@UsuarioAcronimo", (object?)usuarioAcronimo ?? DBNull.Value);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // 1. Mapeamos la entidad Colmena base
                        Colmena c = new Colmena
                        {
                            id = Convert.ToInt32(reader["id"]),
                            id_colmena_usuario = reader["id_colmena_usuario"].ToString() ?? "",
                            fecha_inicio = reader["fecha_inicio"] != DBNull.Value ? (DateTime)reader["fecha_inicio"] : DateTime.Now,
                            es_enjambre = reader["es_enjambre"] != DBNull.Value && (bool)reader["es_enjambre"],
                            id_colmena_madre = reader["id_colmena_madre"] != DBNull.Value ? Convert.ToInt32(reader["id_colmena_madre"]) : (int?)null,
                            activo = reader["activo"] != DBNull.Value && (bool)reader["activo"],
                            tipo_colmena = reader["tipo_colmena"].ToString() ?? "",
                            estado = reader["estado"].ToString() ?? "",
                            // Usamos el campo correcto para la fecha de la reina (con soporte para nulos)
                            fecha_inicio_reina = reader["fecha_inicio_reina"] != DBNull.Value ? (DateTime)reader["fecha_inicio_reina"] : (DateTime?)null
                        };

                        // 2. Usamos el constructor de ColmenaWS para empaquetar todo
                        // Nota: Asegúrate de que el constructor reciba (Colmena, string, DateTime, int)
                        lista.Add(new ColmenaWS(
                            c,
                            reader["nombre_apiario"].ToString() ?? "Sin nombre",
                            reader["fecha_entradaApiario"] != DBNull.Value ? (DateTime)reader["fecha_entradaApiario"] : DateTime.Now,
                            Convert.ToInt32(reader["apiario_id"])
                        ));
                    }
                }
            }
            return lista;
        }

        public int InsertarColmena(string usuarioAcronimo, DateTime fechaInicio, DateTime? fecha_inicio_reina, bool esEnjambre, int? idColmenaMadre, bool activo, string? tipo_colmena, string? estado, string? id_colmena_usuario)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena.InsertarColmena, connection);
                cmd.Parameters.AddWithValue("@UsuarioAcronimo", usuarioAcronimo);
                cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                cmd.Parameters.AddWithValue("@EsEnjambre", esEnjambre);
                cmd.Parameters.AddWithValue("@IdColmenaMadre", (object?)idColmenaMadre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Activo", activo);
                cmd.Parameters.AddWithValue("@Estado", estado);
                cmd.Parameters.AddWithValue("@Tipo_colmena", tipo_colmena);
                cmd.Parameters.AddWithValue("@Id_colmena_usuario", id_colmena_usuario);
                cmd.Parameters.AddWithValue("@Fecha_inicio_reina", (object)fecha_inicio_reina ?? DBNull.Value);
                connection.Open();
                // Usamos ExecuteScalar porque la query termina con SELECT SCOPE_IDENTITY()
                object result = cmd.ExecuteScalar();
                if (result == null || result == DBNull.Value)
                {
                    return 0;
                }

                return Convert.ToInt32(result);
            }
        }


        public List<Colmena_Id_IdAsig> GetLisIdsColmenas(string? usuarioAcronimo = null)
        {
            List<Colmena_Id_IdAsig> lista = new List<Colmena_Id_IdAsig>();

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena.ObtenerColmenaIDs, connection);
                // Manejo de parámetro nulo para que sea compatible con el WHERE de SQL
                cmd.Parameters.AddWithValue("@UsuarioAcronimo", (object?)usuarioAcronimo ?? DBNull.Value);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {                     
                        lista.Add(new Colmena_Id_IdAsig
                        {
                            id = Convert.ToInt32(reader["id"]),
                            id_colmena_usuario = reader["id_colmena_usuario"].ToString() ?? "",
                        });
                    }
                }
            }
            return lista;
        }


        public bool ActualizarColmena(string? usuarioAcronimo = null)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena.ActualizarColmena, connection);
               /* cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@AcronimoUsuario", (object)acronimoUsuario ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NombreReferencia", (object)nombreReferencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Coordenadas", (object)coordenadas ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Msnm", (object)msnm ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Activo", (object)activo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Tipo_flora", (object)tipo_flora ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Descripcion_acceso", (object)descripcion_acceso ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Capacidad_maxima", (object)capacidad_maxima ?? DBNull.Value);*/




                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }









        // 3. ACTUALIZACIÓN DINÁMICA
        public bool ActualizarColmena(int id, string? usuarioAcronimo, DateTime? fechaInicio, bool? esEnjambre, int? idColmenaMadre, bool? activo, int? apiarioId, string? tipoColmena, DateTime? fechaInicioReina, string? estado, string? idColmenaUsuario)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena.ActualizarColmena, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@UsuarioAcronimo", (object)usuarioAcronimo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaInicio", (object)fechaInicio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@EsEnjambre", (object)esEnjambre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdColmenaMadre", (object)idColmenaMadre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Activo", (object)activo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ApiarioId", (object)apiarioId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TipoColmena", (object?)tipoColmena ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaInicioReina", (object)fechaInicioReina ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Estado", (object)estado ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdColmenaUsuario", (object)idColmenaUsuario ?? DBNull.Value);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 4. DESACTIVAR (Borrado Lógico)
        public bool DesactivarColmena(int id)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena.DesactivarColmena, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 5. BORRAR (Borrado Físico)
        public bool BorrarColmena(int id)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena.BorrarColmena, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}