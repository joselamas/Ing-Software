using System.Data.SqlClient; // Asegúrate de tener este paquete o System.Data.SqlClient
using System.IO;

namespace Beekepeer.DDBB
{
    public static class DbInitializer
    {
        public static void Initialize(string localDbServer)
        {
            // 1. Nos conectamos a la base de datos 'master' del LocalDB
            string masterConnection = $"Server={localDbServer};Database=master;Trusted_Connection=True;Encrypt=False;";
            string dbName = "Beekeeper";

            using (var connection = new SqlConnection(masterConnection))
            {
                connection.Open();

                // 2. Revisamos si Beekeeper ya existe
                string checkDbQuery = $"SELECT database_id FROM sys.databases WHERE Name = '{dbName}'";
                using (var checkCmd = new SqlCommand(checkDbQuery, connection))
                {
                    var result = checkCmd.ExecuteScalar();

                    // 3. Si result es null, la base de datos NO existe
                    if (result == null)
                    {
                        // Creamos la base de datos física
                        string createDbQuery = $"CREATE DATABASE {dbName}";
                        using (var createCmd = new SqlCommand(createDbQuery, connection))
                        {
                            createCmd.ExecuteNonQuery();
                        }

                        // 4. Ahora ejecutamos el script de las tablas
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