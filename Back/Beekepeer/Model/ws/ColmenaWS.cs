namespace Beekepeer.Model.ws
{
    public class ColmenaWS
    {
        public Colmena colmena { get; set; }
        public string nombre_apiario { get; set; }
        public DateTime fecha_entradaApiario { get; set; }
        public int apiario_id { get; set; }
        public string coordenadas { get; set; }


        // Constructor
        public ColmenaWS(Colmena colmenaBase, string nombreApiario, DateTime fechaEntrada, int apiarioId, string coordenadasID)
        {
            this.colmena = colmenaBase;
            this.nombre_apiario = nombreApiario;
            this.fecha_entradaApiario = fechaEntrada;
            this.apiario_id = apiarioId;
            this.coordenadas = coordenadasID;


        }

        // Constructor vacío opcional (útil para serialización)
        public ColmenaWS() { }
    }
}