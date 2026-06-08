using Microsoft.EntityFrameworkCore;
using tic_tac.datasource.model;

namespace tic_tac.datasource
{
    public class AppDbContext : DbContext
    {
        public DbSet<GameModel> Games => Set<GameModel>();
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GameModel>(entity =>
            {
                entity.ToTable("games");
                entity.HasKey(e => e.Id);
            });
        }
    }
}
