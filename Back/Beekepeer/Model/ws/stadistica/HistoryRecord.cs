using System.Text.Json.Serialization;

namespace Beekepeer.Model.ws.stadistica
{
    public class HistoryRecord
    {
        public string Mes { get; set; } = string.Empty;

        public double? Eficiencia { get; set; }

        public double? Polen { get; set; }
        public double? Miel { get; set; }  // Suma total en Kg de Miel


    }
}
