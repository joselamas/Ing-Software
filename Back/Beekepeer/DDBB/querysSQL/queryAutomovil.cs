namespace Beekepeer.DDBB.querysSQL
{
    public class queryAutomovil
    {
        // Búsqueda 
        public const string ListarTodos = "SELECT idauto, marca, modelo FROM Autos";

        public const string BuscarPorId = "SELECT idauto, marca, modelo FROM Autos WHERE idauto = @Id";

        public const string BuscarDinamico = @"
            SELECT idauto, marca, modelo 
            FROM Autos 
            WHERE (@Marca IS NULL OR marca LIKE '%' + @Marca + '%')
            AND (@Modelo IS NULL OR modelo LIKE '%' + @Modelo + '%')";

        // Modificación 
        public const string ActualizarMarca = "UPDATE Autos SET marca = @Marca WHERE idauto = @Id";
        public const string ActualizarModelo = "UPDATE Autos SET modelo = @Modelo WHERE idauto = @Id";

        // Eliminación
        public const string Eliminar = "DELETE FROM Autos WHERE idauto = @Id";

        // Inserción
        public const string Insertar = "INSERT INTO Autos (marca, modelo) VALUES (@Marca, @Modelo)";
    }
}