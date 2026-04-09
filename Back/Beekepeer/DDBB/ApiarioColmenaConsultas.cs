using Beekepeer.DDBB.querysSQL;
using Beekepeer.Model.ws;
using Beekepeer.Model;
using System.Data.SqlClient;
using static Beekepeer.DDBB.querysSQL.queryColmena_Apiario;

namespace Beekepeer.DDBB
{
    public class ApiarioColmenaConsultas
    {
        private readonly string _sqlurl;

        public ApiarioColmenaConsultas(string configuration)
        {
            _sqlurl = configuration;
        }

        public int InsertarColmenaEnApiario(string acronimoUsuario, int colmena_id, int apiario_id, DateTime fecha_entrada)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmena_Apiario.Insertar, connection);
                cmd.Parameters.AddWithValue("@AcronimoUsuario", acronimoUsuario);
                cmd.Parameters.AddWithValue("@Fecha_entrada", fecha_entrada);
                cmd.Parameters.AddWithValue("@ApiarioId", apiario_id);
                cmd.Parameters.AddWithValue("@Colmena_id", colmena_id);


                connection.Open();
                object result = cmd.ExecuteScalar();
                return result != null ? Convert.ToInt32(result) : 0;
            }
        }
        public List<ColmenaApiarioWS> GetLisColmenasApiario(string? usuarioAcronimo = null)
        {
            List<ColmenaApiarioWS> lista = new List<ColmenaApiarioWS>();
            List<Colmena> listaEnapiarios = new List<Colmena>();
            Apiario Api = new Apiario();


            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                // Nota: Asegúrate de que queryColmenas.Apiarios_Colmenas apunte al string de arriba
                SqlCommand cmd = new SqlCommand(queryColmena_Apiario.Apiarios_Colmenas, connection);

                // Manejo de parámetro nulo para compatibilidad con el WHERE de SQL
                cmd.Parameters.AddWithValue("@Acronimo_usuario", (object?)usuarioAcronimo ?? DBNull.Value);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    Colmena c = new Colmena();
                    while (reader.Read())
                    {
                        //vemos si las colmenas son de apiarios diferente.
                        if (Api.id != null && Api.id != Convert.ToInt32(reader["apiario_id"]) && Api.id != 0)
                        {
                            lista.Add(
                                new ColmenaApiarioWS
                                {
                                    listColmenas = listaEnapiarios,
                                    apiario = Api
                                });
                            listaEnapiarios = new List<Colmena>();
                            Api = new Apiario();

                        }
                        // 1. Mapeamos la entidad Colmena base
                        if (reader["fecha_inicio"] != DBNull.Value)
                        {
                            listaEnapiarios.Add(new Colmena
                            {
                                id = Convert.ToInt32(reader["id"]),
                                id_colmena_usuario = reader["id_colmena_usuario"].ToString() ?? "",
                                fecha_inicio = reader["fecha_inicio"] != DBNull.Value
                                               ? (DateTime)reader["fecha_inicio"]
                                               : DateTime.Now,
                                es_enjambre = reader["es_enjambre"] != DBNull.Value && (bool)reader["es_enjambre"],
                                id_colmena_madre = reader["id_colmena_madre"] != DBNull.Value
                                                   ? Convert.ToInt32(reader["id_colmena_madre"])
                                                   : (int?)null,
                                activo = reader["colmena_activo"] != DBNull.Value && (bool)reader["colmena_activo"],
                                tipo_colmena = reader["tipo_colmena"].ToString() ?? "",
                                estado = reader["estado"].ToString() ?? "",
                                fecha_inicio_reina = reader["fecha_inicio_reina"] != DBNull.Value
                                                     ? (DateTime)reader["fecha_inicio_reina"]
                                                     : DateTime.Now,
                            }
                        );
                        };

                        Api = new Apiario
                        {
                            id = Convert.ToInt32(reader["apiario_id"]),
                            msnm = Convert.ToInt32(reader["msnm"]),
                            acronimo_usuario = reader["acronimo_usuario"].ToString() ?? "",
                            nombre_referencia = reader["nombre_referencia"].ToString() ?? "",
                            coordenadas = reader["coordenadas"].ToString() ?? "",
                            tipo_flora = reader["tipo_flora"].ToString() ?? "",
                            capacidad_maxima = Convert.ToInt32(reader["capacidad_maxima"]),
                            descripcion_acceso = reader["descripcion_acceso"].ToString() ?? "",
                            activo = reader["apiario_activo"] != DBNull.Value && (bool)reader["apiario_activo"],
                            fecha_creacion = (DateTime)(reader["fecha_creacion"] != DBNull.Value
                                                 ? (DateTime)reader["fecha_creacion"]
                                                 : (DateTime?)null)
                        };
                    }
                }
            }
            return lista;
        }

    }
}
