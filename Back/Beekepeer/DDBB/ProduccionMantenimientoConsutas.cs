using Beekepeer.DDBB.querysSQL;
using Beekepeer.Model;
using Beekepeer.Model.ws;
using System.Data.SqlClient;

namespace Beekepeer.DDBB
{
    public class ProduccionMantenimientoConsutas
    {

        private readonly string _sqlurl;

        public ProduccionMantenimientoConsutas(string configuration)
        {
            _sqlurl = configuration;
        }



        public int InsertarProduccion(Produccion data)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryProduccionMantenimiento.InsertarProduccion, connection);
                cmd.Parameters.AddWithValue("@Colmena_id", data.colmena_id);
                cmd.Parameters.AddWithValue("@Fecha", data.fecha);
                cmd.Parameters.AddWithValue("@Tipo_origen", data.tipo_origen);
                cmd.Parameters.AddWithValue("@Tipo_producto", data.tipo_producto);
                cmd.Parameters.AddWithValue("@Descripcion_flora", data.descripcion_flora);
                cmd.Parameters.AddWithValue("@Cantidad_kg", data.cantidad_kg);
                cmd.Parameters.AddWithValue("@Precio_aprox_kg", data.precio_aprox_kg);
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

        public List<ProduccionWS> getListProduccion(string acronimo)
        {
            List<ProduccionWS> lista = new List<ProduccionWS>();

            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                // Asegúrate de que queryProduccionMantenimiento.GetListProduccion contenga el SQL que pusiste arriba
                SqlCommand cmd = new SqlCommand(queryProduccionMantenimiento.GetListProduccion, connection);
                cmd.Parameters.AddWithValue("@Acronimo", acronimo);

                connection.Open();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var item = new ProduccionWS
                        {
                            // Mapeo de campos directos de ProduccionWS
                            id_colmena_usuario = reader["id_colmena_usuario"].ToString(),
                            idColmena = Convert.ToInt32(reader["idColmena"]),
                            nombre_referencia_Apiario = reader["nombre_referencia"].ToString(),

                            // Instanciamos el objeto interno Produccion y mapeamos sus campos
                            produccion = new Produccion
                            {
                                fecha = Convert.ToDateTime(reader["fecha"]),
                                tipo_producto = reader["tipo_producto"].ToString(),
                                tipo_origen = reader["tipo_origen"].ToString(),
                                cantidad_kg = (float)Convert.ToDecimal(reader["cantidad_kg"]),
                                precio_aprox_kg = (float)Convert.ToDecimal(reader["precio_aprox_kg"])
                                // Agrega aquí otros campos de 'Produccion' si existen en el SELECT
                            }
                        };

                        lista.Add(item);
                    }
                }
            }

            return lista;
        }


        public int InsertarAlimentacion(Alimentacion data)
        {
            using (SqlConnection connection = new SqlConnection(_sqlurl))
            {
                SqlCommand cmd = new SqlCommand(queryProduccionMantenimiento.InsertarAlimentacion, connection);
                cmd.Parameters.AddWithValue("@Colmena_id", data.colmena_id);
                cmd.Parameters.AddWithValue("@Fecha", data.fecha);
                cmd.Parameters.AddWithValue("@Tipo_suministro", data.tipo_suministro);
                cmd.Parameters.AddWithValue("@Detalle_mezcla", (object?)data.detalle_mezcla ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Cantidad", data.cantidad);
                cmd.Parameters.AddWithValue("@Precio_total_insumo", data.precio_total_insumo);
                cmd.Parameters.AddWithValue("@Observaciones", data.observaciones);
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

    }
}
