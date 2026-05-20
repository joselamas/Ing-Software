using System.Diagnostics;

namespace Beekepeer
{
    public static class ControladorNavegador
    {
        public static void AbrirInterfazLocal()
        {
            string url = "http://localhost:5000";
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "msedge", // Llamamos a Microsoft Edge
                    Arguments = $"--app={url}", // Comando mágico que oculta el navegador
                    UseShellExecute = true
                });
            }
            catch
            {
                // Plan B: Si no tiene Edge, lo abre en su navegador por defecto normal
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
        }
    }
}