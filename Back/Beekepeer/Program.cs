using Beekepeer.DDBB;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
var sqlUrl = builder.Configuration.GetConnectionString("DefaultConnection");
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

//app.UseDefaultFiles(); // Para que busque el index.html automáticamente

//app.UseStaticFiles();  // Para servir los archivos de React

app.MapControllers();

//DbInitializer.Initialize("(localdb)\\MSSQLLocalDB");

app.Run();
