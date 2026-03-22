using Beekepeer.Model;
using System.Data.SqlClient;
using System.Data;
using Beekepeer.DDBB.querysSQL;

namespace Beekepeer.DDBB
{
    public class automovilConsultas
    {
        private readonly string _sqlurl;

        public automovilConsultas(string configuration)
        {
            _sqlurl = configuration;
        }

        // 1. OBTENER TODOS
        public List<automovilClass> GetListAutomovil()
        {
            List<automovilClass> listAutos = new List<automovilClass>();

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                connection.Open();
                SqlCommand cmd = new SqlCommand(queryAutomovil.ListarTodos, connection);

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        listAutos.Add(new automovilClass
                        {
                            // IMPORTANTE: idauto, marca y modelo en minúsculas como en tu SQL
                            IdAuto = (int)reader["idauto"],
                            Marca = reader["marca"].ToString() ?? "",
                            Modelo = reader["modelo"].ToString() ?? ""
                        });
                    }
                }
            }
            return listAutos;
        }

        // 2. BUSCAR POR ID
        public automovilClass? BuscarAutoXId(int id)
        {
            automovilClass? auto = null;

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryAutomovil.BuscarPorId, connection);
                cmd.Parameters.AddWithValue("@Id", id);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        auto = new automovilClass
                        {
                            IdAuto = (int)reader["idauto"],
                            Marca = reader["marca"].ToString() ?? "",
                            Modelo = reader["modelo"].ToString() ?? ""
                        };
                    }
                }
            }
            return auto;
        }

        // 3. BÚSQUEDA DINÁMICA
        public List<automovilClass> BuscarAutomoviles(string? marca, string? modelo)
        {
            List<automovilClass> listAutos = new List<automovilClass>();

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryAutomovil.BuscarDinamico, connection);

                cmd.Parameters.Add("@Marca", SqlDbType.NVarChar).Value =
                    string.IsNullOrWhiteSpace(marca) ? DBNull.Value : marca;

                cmd.Parameters.Add("@Modelo", SqlDbType.NVarChar).Value =
                    string.IsNullOrWhiteSpace(modelo) ? DBNull.Value : modelo;

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        listAutos.Add(new automovilClass
                        {
                            IdAuto = (int)reader["idauto"],
                            Marca = reader["marca"].ToString() ?? "",
                            Modelo = reader["modelo"].ToString() ?? ""
                        });
                    }
                }
            }
            return listAutos;
        }

        // 4. ACTUALIZAR MARCA
        public bool ModificarMarca(int id, string nuevaMarca)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryAutomovil.ActualizarMarca, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Marca", nuevaMarca);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 5. ACTUALIZAR MODELO
        public bool ModificarModelo(int id, string nuevoModelo)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryAutomovil.ActualizarModelo, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Modelo", nuevoModelo);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 6. ELIMINAR POR ID
        public bool EliminarAutomovil(int id)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryAutomovil.Eliminar, connection);
                cmd.Parameters.AddWithValue("@Id", id);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 7. INSERTAR
        public bool InsertarAutomovil(string marca, string modelo)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryAutomovil.Insertar, connection);
                cmd.Parameters.AddWithValue("@Marca", marca);
                cmd.Parameters.AddWithValue("@Modelo", modelo);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}