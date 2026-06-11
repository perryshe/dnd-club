using Microsoft.EntityFrameworkCore;
using tic_tac.datasource.model;

namespace tic_tac.datasource
{
    public class AppDbContext : DbContext
    {
        public DbSet<GameModel> Games => Set<GameModel>();
        public DbSet<UserModel> Users => Set<UserModel>();

        // Настраиваем маппинг для сущности GameModel
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GameModel>(entity =>
            {
                entity.ToTable("games");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Board)
                    .HasColumnType("jsonb")
                    .HasConversion(
                        v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                        v => System.Text.Json.JsonSerializer.Deserialize<BoardModel>(v, (System.Text.Json.JsonSerializerOptions?)null)!);
            });
            modelBuilder.Entity<UserModel>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Login).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Password).IsRequired();
            });
        }
    }
}
