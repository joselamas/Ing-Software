using Beekepeer.DDBB;
using Beekepeer;
using System.Diagnostics;
using System.Windows.Forms; // Para el System Tray
using System.Threading;     // Para crear el hilo paralelo
using System.Drawing;       // Para cargar tu logo.ico

var builder = WebApplication.CreateBuilder(args);

Mutex? keepAliveMutex = null;

if (builder.Environment.IsProduction())
{
    keepAliveMutex = new Mutex(true, "Beekeeper_Server", out bool esNuevaInstancia);

    if (!esNuevaInstancia)
    {
        string url = "http://localhost:5000";
        try { 
            Process.Start(new ProcessStartInfo { 
                FileName = "msedge", 
                Arguments = $"--app={url}", 
                UseShellExecute = true 
            }); 
        }
        catch { 
            Process.Start(new ProcessStartInfo { 
                FileName = url, UseShellExecute = true 
            }); 
        }
        return; // Detiene la ejecución ANTES de construir el servidor
    }
}

// Permitir conexiones desde la red local
builder.WebHost.UseUrls("http://0.0.0.0:5000");

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

    ConfiguracionRemota.GenerarScriptBat();

    GestorLocalDB.DespertarEInicializar();

    ControladorNavegador.AbrirInterfazLocal();

    ControladorBandeja.IniciarIcono();
}

app.Run();

// Liberamos la memoria del Mutex al apagar el servidor
keepAliveMutex?.Dispose();