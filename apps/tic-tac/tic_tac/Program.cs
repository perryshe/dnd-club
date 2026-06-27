using Microsoft.EntityFrameworkCore;
using Npgsql;
using tic_tac.datasource;
using tic_tac.di;

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
using (var conn = new NpgsqlConnection(builder.Configuration.GetConnectionString("AdminConnection")))
{
    conn.Open();
    using var cmd = conn.CreateCommand();
    cmd.CommandText = "CREATE DATABASE tic_tac OWNER dndclub";
    try { cmd.ExecuteNonQuery(); } catch (Npgsql.PostgresException ex) when (ex.SqlState == "42P04") { }
}
// === СБОРКА ПРИЛОЖЕНИЯ ===

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    // Создаём новые таблицы если БД уже существовала (EnsureCreated не добавляет их)
    db.Database.ExecuteSqlRaw("""
        CREATE TABLE IF NOT EXISTS users (
            "Id" uuid PRIMARY KEY,
            "Login" text NOT NULL,
            "PasswordHash" text NOT NULL,
            "CreatedAt" timestamptz NOT NULL
        )
    """);
    db.Database.ExecuteSqlRaw("""
        CREATE TABLE IF NOT EXISTS game_results (
            "Id" uuid PRIMARY KEY,
            "UserId" uuid NOT NULL,
            "Result" integer NOT NULL,
            "Timestamp" timestamptz NOT NULL
        )
    """);
    try { db.Database.ExecuteSqlRaw("""CREATE UNIQUE INDEX IF NOT EXISTS "IX_users_Login" ON users ("Login")"""); } catch { }
    // Sync existing users: replace email logins with school nicknames from main DB
    try
    {
        var clubConnStr = app.Configuration.GetConnectionString("ClubConnection");
        if (!string.IsNullOrEmpty(clubConnStr))
        {
            var emailUsers = db.Users.Where(u => u.Login.Contains("@")).ToList();
            foreach (var user in emailUsers)
            {
                using var clubConn = new NpgsqlConnection(clubConnStr);
                clubConn.Open();
                using var cmd = clubConn.CreateCommand();
                cmd.CommandText = "SELECT school_nick FROM users WHERE email = @email";
                cmd.Parameters.AddWithValue("@email", NpgsqlTypes.NpgsqlDbType.Text, user.Login);
                var schoolNick = cmd.ExecuteScalar() as string;
                if (!string.IsNullOrEmpty(schoolNick))
                {
                    Console.WriteLine($"Syncing user: {user.Login} -> {schoolNick}");
                    user.Login = schoolNick;
                }
            }
            db.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"User sync error (non-fatal): {ex.Message}");
    }
}
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
Console.WriteLine("  POST /api/auth/register   - Register new user");
Console.WriteLine("  POST /api/auth/login      - Login (Basic Auth)");
Console.WriteLine("  GET  /api/game            - Create new game [Auth]");
Console.WriteLine("  GET  /api/game/{id}       - Get game by ID [Auth]");
Console.WriteLine("  POST /api/game/{id}       - Make move [Auth]");
Console.WriteLine("  POST /api/stats/record    - Record game result [Auth]");
Console.WriteLine("  GET  /api/stats/leaderboard - Leaderboard");

// Запускаем сервер (блокирующий вызов)
app.Run();
