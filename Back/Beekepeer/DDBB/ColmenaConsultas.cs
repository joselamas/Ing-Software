using Beekepeer.Model;
using System.Data.SqlClient;
using Beekepeer.DTOs;
using Beekepeer.DDBB.querysSQL;
using System;
using System.Collections.Generic;
using static Beekepeer.DDBB.querysSQL.queryColmena;

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
        public List<ColmenaDashboardDTO> GetColmenas(string? usuarioAcronimo = null)
        {
            List<ColmenaDashboardDTO> lista = new List<ColmenaDashboardDTO>();

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmenas.BuscarColmenasXUsusario, connection);
                // Si enviamos null, la query traerá todas por la condición OR @UsuarioAcronimo IS NULL
                cmd.Parameters.AddWithValue("@UsuarioAcronimo", (object)usuarioAcronimo ?? DBNull.Value);

                connection.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        lista.Add(new ColmenaDashboardDTO
                        {
                            id = (int)reader["id"],
                            usuario_acronimo = reader["usuario_acronimo"].ToString() ?? "",
                            fecha_inicio = reader["fecha_inicio"] != DBNull.Value ? (DateTime)reader["fecha_inicio"] : DateTime.Now,
                            es_enjambre = reader["es_enjambre"] != DBNull.Value && (bool)reader["es_enjambre"],
                            id_colmena_madre = reader["id_colmena_madre"] != DBNull.Value ? (int)reader["id_colmena_madre"] : (int?)null,
                            activo = reader["activo"] != DBNull.Value && (bool)reader["activo"],
                            apiario_id = (int)reader["apiario_id"]
                        });
                    }
                }
            }
            return lista;
        }

        // 2. INSERTAR COLMENA (Retorna el ID generado)
        public int InsertarColmena(string usuarioAcronimo, DateTime fechaInicio, bool esEnjambre, int? idColmenaMadre, bool activo, int apiarioId)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmenas.InsertarColmena, connection);
                cmd.Parameters.AddWithValue("@UsuarioAcronimo", usuarioAcronimo);
                cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                cmd.Parameters.AddWithValue("@EsEnjambre", esEnjambre);
                cmd.Parameters.AddWithValue("@IdColmenaMadre", (object?)idColmenaMadre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Activo", activo);
                cmd.Parameters.AddWithValue("@ApiarioId", apiarioId);

                connection.Open();
                // Usamos ExecuteScalar porque la query termina con SELECT SCOPE_IDENTITY()
                object result = cmd.ExecuteScalar();
                return result != null ? Convert.ToInt32(result) : 0;
            }
        }

        // 3. ACTUALIZACIÓN DINÁMICA
        public bool ActualizarColmena(int id, string? usuarioAcronimo, DateTime? fechaInicio, bool? esEnjambre, int? idColmenaMadre, bool? activo, int? apiarioId)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmenas.ActualizarColmena, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@UsuarioAcronimo", (object)usuarioAcronimo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaInicio", (object)fechaInicio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@EsEnjambre", (object)esEnjambre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdColmenaMadre", (object)idColmenaMadre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Activo", (object)activo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ApiarioId", (object)apiarioId ?? DBNull.Value);

                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 4. DESACTIVAR (Borrado Lógico)
        public bool DesactivarColmena(int id)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryColmenas.DesactivarColmena, connection);
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
                SqlCommand cmd = new SqlCommand(queryColmenas.BorrarColmena, connection);
                cmd.Parameters.AddWithValue("@Id", id);
                connection.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}