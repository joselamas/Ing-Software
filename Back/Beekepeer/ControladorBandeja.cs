using System;
using System.Drawing;
using System.Threading;
using System.Windows.Forms;

namespace Beekepeer
{
    public static class ControladorBandeja
    {
        public static void IniciarIcono()
        {
            Thread trayThread = new Thread(() =>
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                NotifyIcon trayIcon = new NotifyIcon();

                trayIcon.Text = "Beekeeper - Activo";

                // Carga tu mismo logo. Asegúrate de que 'logo.ico' se copie al directorio de salida
                trayIcon.Icon = new Icon(Path.Combine(AppContext.BaseDirectory, "logo.ico"));
                trayIcon.Visible = true;
               

                ContextMenuStrip menu = new ContextMenuStrip();
                ToolStripMenuItem closeItem = new ToolStripMenuItem("Finalizar Beekeeper");

                closeItem.Click += (sender, e) =>
                {
                    DialogResult dialogResult = MessageBox.Show(
                        "¿Realmente desea finalizar Beekeeper y apagar el servidor?",
                        "Confirmar cierre",
                        MessageBoxButtons.YesNo,
                        MessageBoxIcon.Question);

                    if (dialogResult == DialogResult.Yes)
                    {
                        trayIcon.Visible = false; // Esconde el icono limpiamente
                        Environment.Exit(0);      // Apaga el programa completo
                    }
                };

                menu.Items.Add(closeItem);
                trayIcon.ContextMenuStrip = menu;

                // Mantiene el hilo visual vivo esperando clics
                Application.Run();
            });

            // Requisitos estrictos de Windows para interfaces gráficas en hilos
            trayThread.SetApartmentState(ApartmentState.STA);
            trayThread.IsBackground = true;
            trayThread.Start();
        }
    }
}