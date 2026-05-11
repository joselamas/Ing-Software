using System.Text.Json.Serialization;

namespace Beekepeer.Model.ws.stadistica
{
    public class ApiaryResponse
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public int ColmenasActivas { get; set; }

        public List<HistoryRecord> Historico { get; set; } = new();
    }
}
