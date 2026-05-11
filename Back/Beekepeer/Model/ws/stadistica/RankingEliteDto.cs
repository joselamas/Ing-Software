namespace Beekepeer.Model.ws.stadistica
{
    public class RankingEliteDto
    {
        public string Id_colmena { get; set; }
        public string Apiario { get; set; }
        public int Msnm { get; set; }
        public DateTime? FechaInicio { get; set; }
        public double? Produccion { get; set; } // Total acumulado en Kg
    }
}
