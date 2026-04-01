using Beekepeer.Model;
using System.Data.SqlClient;
using Beekepeer.DDBB.querysSQL;
using System;
using System.Collections.Generic;

namespace Beekepeer.DDBB
{
    public class ApiarioConsultas
    {
        private readonly string _sqlurl;

        public ApiarioConsultas(string configuration)
        {
            _sqlurl = configuration;
        }

        // 1. LISTAR APIARIOS (Por usuario o todos)
        public List<Apiario> GetApiarios(string? acronimoUsuario = null)
        {
            List<Apiario> lista = new List<Apiario>();

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryApiario.ListarApiarios, connection);
                cmd.Parameters.AddWithValue("@AcronimoUsuario", (object)acronimoUsuario ?? DBNull.Value);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        lista.Add(new Apiario
                        {
                            id = (int)reader["id"],
                            acronimo_usuario = reader["acronimo_usuario"].ToString() ?? "",
                            nombre_referencia = reader["nombre_referencia"].ToString() ?? "",
                            coordenadas = reader["coordenadas"].ToString() ?? "",
                            msnm = reader["msnm"] != DBNull.Value ? (int)reader["msnm"] : 0,
                            activo = reader["activo"] != DBNull.Value && (bool)reader["activo"]
                        });
                    }
                }
            }
            return lista;
        }

        // 2. BUSCAR POR ID
        public Apiario? GetApiarioPorId(int id)
        {
            Apiario? apiario = null;

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryApiario.BuscarPorId, connection);
                cmd.Parameters.AddWithValue("@Id", id);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        apiario = new Apiario
                        {
                            id = (int)reader["id"],
                            acronimo_usuario = reader["acronimo_usuario"].ToString() ?? "",
                            nombre_referencia = reader["nombre_referencia"].ToString() ?? "",
                            coordenadas = reader["coordenadas"].ToString() ?? "",
                            msnm = reader["msnm"] != DBNull.Value ? (int)reader["msnm"] : 0,
                            activo = reader["activo"] != DBNull.Value && (bool)reader["activo"]
                        };
                    }
                }
            }
            return apiario;
        }

        // 3. INSERTAR APIARIO
        public int InsertarApiario(string acronimoUsuario, string nombreReferencia, string coordenadas, int msnm, bool activo)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryApiario.InsertarApiario, connection);
                cmd.Parameters.AddWithValue("@AcronimoUsuario", acronimoUsuario);
                cmd.Parameters.AddWithValue("@NombreReferencia", nombreReferencia);
                cmd.Parameters.AddWithValue("@Coordenadas", coordenadas);
                cmd.Parameters.AddWithValue("@Msnm", msnm);
                cmd.Parameters.AddWithValue("@Activo", activo);

                connection.Open();
                object result = cmd.ExecuteScalar();
                return result != null ? Convert.ToInt32(result) : 0;
            }
        }

        // 4. ACTUALIZACIÓN DINÁMICA
        public bool ActualizarApiario(int id, string? acronimoUsuario, string? nombreReferencia, string? coordenadas, int? msnm, bool? activo)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryApiario.ActualizarApiario, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@AcronimoUsuario", (object)acronimoUsuario ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NombreReferencia", (object)nombreReferencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Coordenadas", (object)coordenadas ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Msnm", (object)msnm ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Activo", (object)activo ?? DBNull.Value);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 5. BORRADO LÓGICO Y FÍSICO
        public bool DesactivarApiario(int id)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryApiario.DesactivarApiario, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool EliminarApiario(int id)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryApiario.EliminarApiario, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}