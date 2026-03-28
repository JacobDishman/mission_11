using Microsoft.EntityFrameworkCore;
using Mission11.API.Models;

namespace Mission11.API.Data
{
    // The DbContext is the main class that EF Core uses to interact with the database.
    // Think of it as the "bridge" between your C# code and the SQLite database.
    // It handles:
    //   - Opening/closing database connections
    //   - Translating LINQ queries into SQL
    //   - Tracking changes to objects so it knows what to INSERT/UPDATE/DELETE
    //
    // We inherit from DbContext (provided by EF Core) and add our own DbSet properties.
    public class BookstoreContext : DbContext
    {
        // This constructor accepts DbContextOptions, which contains the database connection
        // configuration (like the connection string). These options are passed in by the
        // dependency injection system — we configure them in Program.cs.
        // The ": base(options)" part passes the options up to the parent DbContext class.
        public BookstoreContext(DbContextOptions<BookstoreContext> options)
            : base(options) { }

        // A DbSet<Book> represents the "Books" table in the database.
        // Each DbSet maps to one table, and each item in the DbSet is one row.
        //
        // When we write _context.Books in our controller, EF Core knows to query the "Books" table.
        // We can chain LINQ methods like .Where(), .OrderBy(), .Skip(), .Take() onto it,
        // and EF Core translates them into SQL behind the scenes.
        //
        // Example: _context.Books.OrderBy(b => b.Title).Take(5)
        //   becomes: SELECT * FROM Books ORDER BY Title LIMIT 5
        public DbSet<Book> Books { get; set; }
    }
}
