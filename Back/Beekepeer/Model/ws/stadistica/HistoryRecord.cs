using System.Text.Json.Serialization;

namespace Beekepeer.Model.ws.stadistica
{
    public class HistoryRecord
    {
        public string Mes { get; set; } = string.Empty;

        // Métricas de Rendimiento y Producción
        public double? Eficiencia { get; set; }
        public double? Polen { get; set; }
        public double? Miel { get; set; }

        // Métricas de Alimentación (Nuevas)
        public double? Jarabe { get; set; } // Generalmente en Litros
        public double? Torta { get; set; }  // Generalmente en Kilogramos
    }
}