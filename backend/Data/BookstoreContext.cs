using Microsoft.EntityFrameworkCore;
using Mission11.API.Models;

namespace Mission11.API.Data
{
    // EF Core DbContext for the Bookstore SQLite database.
    public class BookstoreContext : DbContext
    {
        public BookstoreContext(DbContextOptions<BookstoreContext> options)
            : base(options) { }

        public DbSet<Book> Books { get; set; }
    }
}
