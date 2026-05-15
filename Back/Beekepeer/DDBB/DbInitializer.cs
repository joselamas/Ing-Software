using System;
using System.Data.SqlClient; // Asegúrate de tener este paquete o System.Data.SqlClient
using System.IO;

namespace Beekepeer.DDBB
{
    public static class DbInitializer
    {
        public static void Initialize(string localDbServer)
        {
            string dbName = "Beekeeper";

            // Definimos y creamos la carpeta "Datos" dentro de la ruta del ejecutable
            string baseDir = AppContext.BaseDirectory;
            string dataFolderPath = Path.Combine(baseDir, "Datos");

            if (!Directory.Exists(dataFolderPath))
            {
                Directory.CreateDirectory(dataFolderPath);
            }

            // Rutas completas para los archivos físicos
            string mdfPath = Path.Combine(dataFolderPath, "Beekeeper.mdf");
            string ldfPath = Path.Combine(dataFolderPath, "Beekeeper_log.ldf");

            // Nos conectamos a la base de datos 'master' del LocalDB
            string masterConnection = $"Server={localDbServer};Database=master;Trusted_Connection=True;Encrypt=False;";
            

            using (var connection = new SqlConnection(masterConnection))
            {
                connection.Open();

                // Revisamos si Beekeeper ya existe
                string checkDbQuery = $"SELECT database_id FROM sys.databases WHERE Name = '{dbName}'";
                using (var checkCmd = new SqlCommand(checkDbQuery, connection))
                {
                    var result = checkCmd.ExecuteScalar();

                    // Si result es null, la base de datos NO existe
                    if (result == null)
                    {
                        // Creamos la base de datos especificando la ubicación de los archivos
                        string createDbQuery = $@"
                            CREATE DATABASE [{dbName}] 
                            ON PRIMARY (NAME = {dbName}_Data, FILENAME = '{mdfPath}') 
                            LOG ON (NAME = {dbName}_Log, FILENAME = '{ldfPath}')";

                        using (var createCmd = new SqlCommand(createDbQuery, connection))
                        {
                            createCmd.ExecuteNonQuery();
                        }

                        // Ahora ejecutamos el script de las tablas
                        EjecutarScriptTablas(localDbServer, dbName);
                    }
                }
            }
        }

        private static void EjecutarScriptTablas(string server, string dbName)
        {
            // Buscamos el archivo SQL que guardamos en el Paso 1
            string scriptPath = Path.Combine(AppContext.BaseDirectory, "DDBB", "InitDB.sql");

            if (File.Exists(scriptPath))
            {
                string scriptSql = File.ReadAllText(scriptPath);

                // Nos conectamos ESPECÍFICAMENTE a la nueva base de datos Beekeeper
                string targetConnection = $"Server={server};Database={dbName};Trusted_Connection=True;Encrypt=False;";

                using (var targetDb = new SqlConnection(targetConnection))
                {
                    targetDb.Open();
                    using (var scriptCmd = new SqlCommand(scriptSql, targetDb))
                    {
                        scriptCmd.ExecuteNonQuery();
                    }
                }
            }
        }
    }
}