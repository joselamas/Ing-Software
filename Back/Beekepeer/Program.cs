using Beekepeer.DDBB;
using System.Diagnostics;
using System.Windows.Forms; // Para el System Tray
using System.Threading;     // Para crear el hilo paralelo
using System.Drawing;       // Para cargar tu logo.ico


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
var sqlUrl = builder.Configuration.GetConnectionString("DefaultConnection");

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});
var app = builder.Build();
app.UseCors(options => {
    options.AllowAnyOrigin(); // O http://localhost:3000
    options.AllowAnyMethod();
    options.AllowAnyHeader();
});
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Código para Producción (Navegador + Icono Oculto)
if (app.Environment.IsProduction())
{

    app.UseDefaultFiles(); // Para que busque el index.html automáticamente

    app.UseStaticFiles();  // Para servir los archivos de React

    DbInitializer.Initialize("(localdb)\\MSSQLLocalDB");

    // 1. Abrimos el navegador
    string url = "http://localhost:5000";

    try
    {
        Process.Start(new ProcessStartInfo
        {
            FileName = "msedge", // Llamamos a Microsoft Edge
            Arguments = $"--app={url}", // Este es el comando mágico que oculta el navegador
            UseShellExecute = true
        });
    }
    catch
    {
        // Plan B: Si por algún milagro no tiene Edge, lo abre en su navegador por defecto normal
        Process.Start(new ProcessStartInfo
        {
            FileName = url,
            UseShellExecute = true
        });
    }

    // 2. Creamos un hilo separado para el icono de la barra de tareas
    Thread trayThread = new Thread(() =>
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        // Creamos el icono
        NotifyIcon trayIcon = new NotifyIcon();
        trayIcon.Text = "Beekeeper - Activo";

        // Carga tu mismo logo. Asegúrate de que 'logo.ico' se copie al directorio de salida
        trayIcon.Icon = new Icon(Path.Combine(AppContext.BaseDirectory, "logo.ico"));
        trayIcon.Visible = true;

        // Creamos el menú de clic derecho
        ContextMenuStrip menu = new ContextMenuStrip();
        ToolStripMenuItem closeItem = new ToolStripMenuItem("Finalizar Beekeeper");

        // Lógica al hacer clic en "Finalizar Beekeeper"
        closeItem.Click += (sender, e) =>
        {
            // Muestra el mensaje de confirmación
            DialogResult dialogResult = MessageBox.Show(
                "¿Realmente desea finalizar Beekeeper y apagar el servidor?",
                "Confirmar cierre",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question);

            // Si el usuario presiona "Sí"
            if (dialogResult == DialogResult.Yes)
            {
                trayIcon.Visible = false; // Esconde el icono limpiamente
                Environment.Exit(0);      // Apaga TODO el programa y el servidor
            }
            // Si presiona "No", el if se ignora y el programa sigue corriendo normal
        };

        menu.Items.Add(closeItem);
        trayIcon.ContextMenuStrip = menu;

        // Mantiene el hilo visual vivo esperando clics
        Application.Run();
    });

    // Configuramos el hilo para que sea compatible con ventanas y lo iniciamos
    trayThread.SetApartmentState(ApartmentState.STA);

    // Le decimos que es secundario para que finalice si el servidor finaliza
    trayThread.IsBackground = true;

    // Iniciamos el hilo
    trayThread.Start();
}

app.Run();
