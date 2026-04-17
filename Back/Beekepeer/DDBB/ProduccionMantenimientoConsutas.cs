using Beekepeer.DDBB.querysSQL;
using Beekepeer.Model;
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
