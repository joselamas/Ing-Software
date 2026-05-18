namespace Beekepeer.Model.ws
{
    public class HistorialColmenaResponse
    {
        public List<Alimentacion> Alimentacion { get; set; } = new();
        public List<Produccion> Produccion { get; set; } = new();
    }
}
