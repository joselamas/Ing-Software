using System;
using System.Diagnostics;
using Beekepeer.DDBB;

namespace Beekepeer
{
    public static class GestorLocalDB
    {
        public static void DespertarEInicializar()
        {
            // 1. EL DESPERTADOR: Arrancar LocalDB antes de conectar
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c sqllocaldb start MSSQLLocalDB",
                    CreateNoWindow = true,
                    UseShellExecute = false
                })?.WaitForExit();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Aviso al despertar DB: " + ex.Message);
            }

            // 2. Inicializar la estructura de la base de datos
            DbInitializer.Initialize("(localdb)\\MSSQLLocalDB");
        }
    }
}