﻿﻿﻿using System.Data.SqlClient;
using Beekepeer.DDBB.querysSQL;
using Beekepeer.Model.ws;
using Beekepeer.Model.ws.stadistica;

namespace Beekepeer.DDBB
{
    public class EstadisticasConsultas
    {
        private readonly string _sqlurl;

        public EstadisticasConsultas(string configuration)
        {
            _sqlurl = configuration;
        }

        public EstadisticasGlobalesDto CalcularTodo(string acronimo)
        {
            var dto = new EstadisticasGlobalesDto();

            using (SqlConnection conn = new SqlConnection(_sqlurl))
            {
                conn.Open();

                // 1. Totales y ROI
                using (SqlCommand cmd = new SqlCommand(queryEstadisticas.ObtenerTotalesYRoi, conn))
                {
                    cmd.Parameters.AddWithValue("@Acronimo", acronimo);
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            dto.ProduccionTotal.TotalMiel = Convert.ToDouble(reader["TotalMiel"]);
                            dto.ProduccionTotal.TotalPolen = Convert.ToDouble(reader["TotalPolen"]);
                            dto.GastoTotal.TotalLiquido = Convert.ToDouble(reader["TotalLiquido"]);
                            dto.GastoTotal.TotalSolido = Convert.ToDouble(reader["TotalSolido"]);
                            
                            decimal ingresos = Convert.ToDecimal(reader["Ingresos"]);
                            decimal egresos = Convert.ToDecimal(reader["Egresos"]);
                            
                            dto.Roi.Ingresos = ingresos;
                            dto.Roi.Egresos = egresos;
                            dto.Roi.Beneficio = ingresos - egresos;
                            dto.Roi.Porcentaje = egresos > 0 
                                ? (double)((ingresos - egresos) / egresos) * 100 
                                : 0;
                        }
                    }
                }

                // 2. Tendencia Mensual
                using (SqlCommand cmd = new SqlCommand(queryEstadisticas.ObtenerTendenciaMensual, conn))
                {
                    cmd.Parameters.AddWithValue("@Acronimo", acronimo);
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dto.ComparativaMeses.Add(new ComparativaMesDto
                            {
                                Mes = reader["Mes"].ToString(),
                                Miel = Convert.ToDouble(reader["Miel"]),
                                Polen = Convert.ToDouble(reader["Polen"]),
                                Liquido = Convert.ToDouble(reader["Liquido"]),
                                Solido = Convert.ToDouble(reader["Solido"])
                            });
                        }
                    }
                }

                // 3. Ranking Elite
                using (SqlCommand cmd = new SqlCommand(queryEstadisticas.ObtenerRankingElite, conn))
                {
                    cmd.Parameters.AddWithValue("@Acronimo", acronimo);
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dto.RankingElite.Add(new RankingEliteDto {
                                Id_colmena = reader["Id_colmena"].ToString(),
                                Apiario = reader["Apiario"].ToString(),
                                Msnm = Convert.ToInt32(reader["msnm"]),
                                FechaInicio = reader["FechaInicio"] != DBNull.Value ? Convert.ToDateTime(reader["FechaInicio"]) : null,
                                Produccion = reader["Produccion"] == DBNull.Value ? 0 : Convert.ToDouble(reader["Produccion"])
                            });
                        }
                    }
                }
            }
            return dto;
        }

        public List<ApiaryResponse> EficienciaApiarios(string acronimo)
        {
            var resultadosPlanos = new List<dynamic>();

            using (SqlConnection conn = new SqlConnection(_sqlurl))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(queryEstadisticas.ObtenerRendimientos, conn))
                {
                    cmd.Parameters.AddWithValue("@acronimo", acronimo);

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultadosPlanos.Add(new
                            {
                                Apiario = reader["Apiario"].ToString(),
                                Producto = reader["Producto"].ToString(),
                                Periodo = reader["Periodo"].ToString(),
                                // Validamos si es NULL antes de convertir
                                Rendimiento = reader["Rendimiento_Promedio_Mes"] != DBNull.Value
                                              ? Convert.ToDouble(reader["Rendimiento_Promedio_Mes"])
                                              : 0.0
                            });
                        }
                    }
                }
            }

            // Transformación LINQ para agrupar por Apiario y luego por Mes
            var respuestaFinal = resultadosPlanos
      .GroupBy(r => r.Apiario)
      .Select(apiarioGroup => new ApiaryResponse
      {
          Nombre = apiarioGroup.Key,
          Historico = apiarioGroup
              .GroupBy(h => h.Periodo)
              .Select(monthGroup => new HistoryRecord
              {
                  Mes = monthGroup.Key,
                  // Forzamos el tipo double en el Select y manejamos el nulo
                  Eficiencia = monthGroup
                      .Where(m => m.Producto == "Miel")
                      .Select(m => (double)m.Rendimiento)
                      .DefaultIfEmpty(0.0) // Si no hay miel en ese mes, ponemos 0.0
                      .First(),

                  Polen = monthGroup
                      .Where(m => m.Producto == "Polen")
                      .Select(m => (double)m.Rendimiento)
                      .DefaultIfEmpty(0.0) // Si no hay polen en ese mes, ponemos 0.0
                      .First()
              })
              .OrderBy(h => h.Mes)
              .ToList()
      })
      .ToList();

            return respuestaFinal;
        }

        public List<ApiaryResponse> ProduccionApiarios(string acronimo)
        {
            // Usamos una clase de tipado fuerte para evitar problemas con 'dynamic'
            var resultadosPlanos = new List<ProduccionPlana>();

            using (SqlConnection conn = new SqlConnection(_sqlurl))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand(queryEstadisticas.ObtenerRendimientos, conn))
                {
                    cmd.Parameters.AddWithValue("@acronimo", acronimo);

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultadosPlanos.Add(new ProduccionPlana
                            {
                                Apiario = reader["Apiario"].ToString(),
                                Producto = reader["Producto"].ToString(),
                                Periodo = reader["Periodo"].ToString(),
                                // Capturamos el Total Bruto (Kg) para las gráficas de volumen
                                TotalKg = reader["Total_Kg"] != DBNull.Value
                                          ? Convert.ToDouble(reader["Total_Kg"])
                                          : 0.0
                            });
                        }
                    }
                }
            }

            // Transformación LINQ: Agrupamos por Apiario y luego consolidamos Miel/Polen por Mes
            var respuestaFinal = resultadosPlanos
                .GroupBy(r => r.Apiario)
                .Select(apiarioGroup => new ApiaryResponse
                {
                    // El nombre del apiario se mantiene en Title Case según tus preferencias de UI
                    Nombre = apiarioGroup.Key,
                    Historico = apiarioGroup
                        .GroupBy(h => h.Periodo)
                        .Select(monthGroup => new HistoryRecord
                        {
                            Mes = monthGroup.Key,

                            // Asignamos los brutos de Miel (Cosecha de Miel Kg)
                            Miel = monthGroup
                                .Where(m => m.Producto == "Miel")
                                .Select(m => m.TotalKg)
                                .DefaultIfEmpty(0.0)
                                .First(),

                            // Asignamos los brutos de Polen (Cosecha de Polen Kg)
                            Polen = monthGroup
                                .Where(m => m.Producto == "Polen")
                                .Select(m => m.TotalKg)
                                .DefaultIfEmpty(0.0)
                                .First()
                        })
                        .OrderBy(h => h.Mes) // Orden cronológico para la línea de tiempo
                        .ToList()
                })
                .ToList();

            return respuestaFinal;
        }

        // Clase auxiliar para garantizar el tipado de los datos del Reader
        private class ProduccionPlana
        {
            public string Apiario { get; set; }
            public string Producto { get; set; }
            public string Periodo { get; set; }
            public double TotalKg { get; set; }
        }

        private class AlimentoPlano
        {
            public string Apiario { get; set; }
            public string Categoria { get; set; }
            public string Periodo { get; set; }
            public double Cantidad { get; set; }
        }


        public List<ApiaryResponse> ConsumoAlimentoApiarios(string acronimo)
        {
            var resultadosPlanos = new List<AlimentoPlano>();

            using (SqlConnection conn = new SqlConnection(_sqlurl))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(queryEstadisticas.ObtenerConsumoAlimento, conn))
                {
                    cmd.Parameters.AddWithValue("@acronimo", acronimo);
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultadosPlanos.Add(new AlimentoPlano
                            {
                                Apiario = reader["Apiario"].ToString(),
                                Categoria = reader["CategoriaAlimento"].ToString(),
                                Periodo = reader["Periodo"].ToString(),
                                Cantidad = reader["Total_Suministrado"] != DBNull.Value
                                           ? Convert.ToDouble(reader["Total_Suministrado"])
                                           : 0.0
                            });
                        }
                    }
                }
            }

            // Transformación para agrupar por Apiario y consolidar Líquido/Sólido por Mes
            return resultadosPlanos
                .GroupBy(r => r.Apiario)
                .Select(apiarioGroup => new ApiaryResponse
                {
                    Nombre = apiarioGroup.Key,
                    Historico = apiarioGroup
                        .GroupBy(h => h.Periodo)
                        .Select(monthGroup => new HistoryRecord
                        {
                            Mes = monthGroup.Key,
                            // 'Jarabe' mapea a lo que el front espera para líquido
                            Jarabe = monthGroup
                                .Where(m => m.Categoria == "Liquido")
                                .Select(m => m.Cantidad)
                                .DefaultIfEmpty(0.0)
                                .First(),
                            // 'Torta' mapea a lo que el front espera para sólido
                            Torta = monthGroup
                                .Where(m => m.Categoria == "Solido")
                                .Select(m => m.Cantidad)
                                .DefaultIfEmpty(0.0)
                                .First()
                        })
                        .OrderBy(h => h.Mes)
                        .ToList()
                })
                .ToList();
        }
    }
}
