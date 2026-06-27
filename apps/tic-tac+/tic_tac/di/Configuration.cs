using Microsoft.Extensions.DependencyInjection;
using tic_tac.domain.service;
// using tic_tac.datasource.repository;
using tic_tac.datasource.mapper;
using tic_tac.web.mapper;
using tic_tac.web.controller;

namespace tic_tac.di;

/// <summary>
/// Конфигурация dependency injection.
/// Описывает граф зависимостей приложения.
/// </summary>
public static class Configuration
{
    /// <summary>
    /// Регистрирует все сервисы в IServiceCollection.
    /// </summary>
    public static IServiceCollection AddTicTacToeServices(this IServiceCollection services)
    {
        // Datasource layer
        // Mapper — transient (новый каждый раз)
        services.AddTransient<IGameMapper, GameMapper>();

        // Repository — singleton (одно хранилище на всё приложение)
        // services.AddSingleton<IGameRepository, GameRepository>();

        // Domain layer
        // Service — singleton (сервис stateless)
        services.AddSingleton<IGameService, GameService>();

        // Web layer
        // Web Mapper — transient
        services.AddTransient<IGameWebMapper, GameWebMapper>();

        // Controller — transient
        services.AddTransient<GameController>();

        services.AddScoped<IUserService, UserService>();

        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
