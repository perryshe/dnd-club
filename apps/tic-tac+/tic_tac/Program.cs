using tic_tac.di;
using Microsoft.EntityFrameworkCore;
using tic_tac.datasource;

/// <summary>
/// Точка входа в приложение.
/// Запускает ASP.NET Core web-сервер.
/// </summary>

// Создаём WebApplicationBuilder с аргументами командной строки
var builder = WebApplication.CreateBuilder(args);

// === НАСТРОЙКА СЕРВИСОВ ===

// Добавляем сервисы MVC (Controllers + Razor Pages)
builder.Services.AddControllers();

// Добавляем поддержку API Explorer (нужно для Swagger)
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContextPool<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Добавляем генератор Swagger (для документации API)
builder.Services.AddSwaggerGen();

// Добавляем наши сервисы (DI) — регистрация dependency injection
builder.Services.AddTicTacToeServices();

// === СБОРКА ПРИЛОЖЕНИЯ ===

var app = builder.Build();

// === MIDDLEWARE (порядок важен!) ===

// Swagger UI — документация API (доступна по /swagger)
app.UseSwagger();
app.UseSwaggerUI();

// CORS — разрешаем запросы с любого источника (для веб-клиента)
app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

// Статические файлы — отдаём index.html из wwwroot/
app.UseDefaultFiles();
app.UseStaticFiles();

// Маппинг контроллеров — регистрируем наши endpoints
app.MapControllers();

// === ЗАПУСК ===

// Выводим информацию в консоль
Console.WriteLine("Tic-Tac-Toe Server running on http://localhost:5000");
Console.WriteLine("API endpoints:");
Console.WriteLine("  GET  /api/game       - Create new game");
Console.WriteLine("  GET  /api/game/{id}  - Get game by ID");
Console.WriteLine("  POST /api/game/{id}  - Make move");

// Запускаем сервер (блокирующий вызов)
app.Run();
