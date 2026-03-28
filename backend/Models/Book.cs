// These namespaces give us access to data annotation attributes like [Key], [Required], and [Table].
// DataAnnotations = validation attributes; DataAnnotations.Schema = database mapping attributes.
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mission11.API.Models
{
    // This is the "Model" — a C# class that represents a single row in the "Books" table.
    // Entity Framework Core (EF Core) uses this class to map between C# objects and database rows.
    //
    // The [Table("Books")] attribute tells EF Core the exact table name in the SQLite database.
    // Without this, EF Core would look for a table matching the DbSet property name, which
    // happens to also be "Books" — but it's good practice to be explicit.
    // IMPORTANT: The table name is case-sensitive and must match the database exactly ("Books" with capital B).
    [Table("Books")]
    public class Book
    {
        // [Key] marks this property as the Primary Key for the table.
        // EF Core uses this to uniquely identify each row.
        // In the database, BookID is an INTEGER with AUTOINCREMENT, meaning the database
        // automatically assigns the next available ID when a new row is inserted.
        [Key]
        public int BookID { get; set; }

        // [Required] means this field cannot be null in the database.
        // Each property name (Title, Author, etc.) must match the column name in the database EXACTLY.
        // EF Core maps these by convention — same name = same column.
        //
        // The "= string.Empty" is a C# default value to avoid null reference warnings.
        // It doesn't affect the database — it just satisfies the C# compiler's nullable checks.
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Author { get; set; } = string.Empty;

        [Required]
        public string Publisher { get; set; } = string.Empty;

        [Required]
        public string ISBN { get; set; } = string.Empty;

        // IMPORTANT: Classification and Category are TWO SEPARATE columns in the database.
        // The assignment description says "Classification/Category" but the actual database
        // has them as distinct fields. Don't combine them into one property.
        [Required]
        public string Classification { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        // PageCount is an INTEGER in SQLite, so we use int in C#.
        [Required]
        public int PageCount { get; set; }

        // Price is REAL in SQLite (a floating-point number), so we use double in C#.
        // NOTE: We use "double" instead of "decimal" because SQLite's REAL type maps to
        // a 64-bit IEEE floating point, which is what C#'s double is.
        // If this were SQL Server, we'd typically use decimal for money values.
        [Required]
        public double Price { get; set; }
    }
}
