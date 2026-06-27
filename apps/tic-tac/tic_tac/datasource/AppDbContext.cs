using Microsoft.EntityFrameworkCore;
using tic_tac.datasource.model;

namespace tic_tac.datasource
{
    public class AppDbContext : DbContext
    {
        public DbSet<GameModel> Games => Set<GameModel>();
        public DbSet<UserModel> Users => Set<UserModel>();
        public DbSet<GameResultModel> GameResults => Set<GameResultModel>();
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GameModel>(entity =>
            {
                entity.ToTable("games");
                entity.HasKey(e => e.Id);
            });

            modelBuilder.Entity<UserModel>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Login).IsUnique();
            });

            modelBuilder.Entity<GameResultModel>(entity =>
            {
                entity.ToTable("game_results");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.UserId);
            });
        }
    }
}
