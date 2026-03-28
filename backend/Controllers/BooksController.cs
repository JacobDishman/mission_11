using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11.API.Data;

namespace Mission11.API.Controllers
{
    // CONTROLLERS handle incoming HTTP requests and return responses.
    // This is the "C" in MVC (Model-View-Controller), though in an API we don't have views.
    //
    // [Route("api/[controller]")] sets the URL pattern for this controller.
    // [controller] is automatically replaced with the class name minus "Controller",
    // so "BooksController" becomes "api/books".
    // Any HTTP request to /api/books will be handled by this controller.
    [Route("api/[controller]")]

    // [ApiController] enables several API-specific behaviors:
    //   - Automatic model validation (returns 400 if model state is invalid)
    //   - Automatic binding of query parameters to method parameters
    //   - Requires attribute routing (which we set above)
    [ApiController]
    public class BooksController : ControllerBase
    {
        // This is DEPENDENCY INJECTION (DI). Instead of creating a BookstoreContext ourselves,
        // ASP.NET Core's DI container provides one for us via the constructor.
        // The "readonly" keyword means _context can only be set in the constructor, preventing
        // accidental reassignment later. The underscore prefix (_) is a C# convention for
        // private fields.
        private readonly BookstoreContext _context;

        // The DI container calls this constructor and passes in the BookstoreContext
        // that was registered in Program.cs with builder.Services.AddDbContext<>().
        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // [HttpGet] marks this method as handling GET requests to /api/books.
        // The parameters (pageNumber, pageSize, sortByTitle) are automatically bound
        // from the URL query string. For example:
        //   GET /api/books?pageNumber=2&pageSize=10&sortByTitle=true
        //
        // Default values (pageNumber=1, pageSize=5, sortByTitle=false) are used
        // when the caller doesn't provide those query parameters.
        //
        // "async Task<IActionResult>" means this method runs asynchronously (non-blocking)
        // and returns an HTTP response. async/await is used because database queries are I/O
        // operations — we don't want to block the server thread while waiting for the database.
        // [HttpGet] marks this method as handling GET requests to /api/books.
        // The parameters are automatically bound from the URL query string. For example:
        //   GET /api/books?pageNumber=2&pageSize=10&sortByTitle=true&category=Biography
        //
        // Default values are used when the caller doesn't provide those query parameters.
        //
        // "async Task<IActionResult>" means this method runs asynchronously (non-blocking)
        // and returns an HTTP response. async/await is used because database queries are I/O
        // operations — we don't want to block the server thread while waiting for the database.
        [HttpGet]
        public async Task<IActionResult> GetBooks(
            int pageNumber = 1,
            int pageSize = 5,
            bool sortByTitle = false,
            string? category = null)  // NEW for Mission 12: optional category filter
        {
            // Start building a query. AsQueryable() returns an IQueryable<Book>, which
            // represents a query that hasn't been executed yet. We can chain additional
            // operations onto it (like filtering, sorting, and pagination) before it hits the database.
            // This is called "deferred execution" — the SQL isn't generated until we call
            // ToListAsync() or CountAsync().
            var query = _context.Books.AsQueryable();

            // CATEGORY FILTER (Mission 12):
            // If a category was provided, filter the query to only include books in that category.
            // This MUST come before CountAsync() so that totalCount reflects the filtered count,
            // which allows the frontend to calculate the correct number of pagination buttons.
            // For example, if "Biography" has 3 books and pageSize is 5, totalPages = 1 (not 4).
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // If the user wants to sort by title, add an ORDER BY clause to the query.
            // OrderBy(b => b.Title) tells EF Core: "ORDER BY Title ASC" in SQL.
            // The lambda expression (b => b.Title) is a function that takes a Book (b)
            // and returns the Title property — this tells LINQ which field to sort by.
            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }

            // Count the TOTAL number of books (after filtering but before pagination) so the
            // frontend knows how many pages to display. This executes a "SELECT COUNT(*)" query.
            // We use "await" because this is an async database call.
            var totalCount = await query.CountAsync();

            // PAGINATION LOGIC:
            // Skip() and Take() work together to get just one "page" of results.
            //
            // Skip((pageNumber - 1) * pageSize):
            //   - Page 1: Skip(0)  — start from the beginning
            //   - Page 2: Skip(5)  — skip the first 5 books
            //   - Page 3: Skip(10) — skip the first 10 books
            //
            // Take(pageSize):
            //   - Take(5) means "give me only 5 results"
            //
            // In SQL, this becomes: SELECT * FROM Books LIMIT 5 OFFSET 0 (for page 1)
            //
            // ToListAsync() executes the query and returns the results as a List<Book>.
            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Return an HTTP 200 OK response with a JSON body containing:
            //   { "books": [...], "totalCount": 16 }
            //
            // "new { books, totalCount }" creates an anonymous object with two properties.
            // ASP.NET Core's JSON serializer (System.Text.Json) automatically converts this
            // to JSON. It also converts PascalCase C# names to camelCase JSON names, so
            // "books" stays "books" and "totalCount" stays "totalCount".
            //
            // The frontend needs totalCount to calculate how many pagination buttons to show.
            return Ok(new { books, totalCount });
        }

        // GET /api/books/categories
        // Returns a list of all unique book categories in the database.
        // The frontend uses this to dynamically build the category filter buttons.
        // Example response: ["Biography", "Fiction", "Self-Help", "Thrillers"]
        //
        // [HttpGet("categories")] maps to /api/books/categories because:
        //   - The controller route is "api/[controller]" = "api/books"
        //   - The "categories" string is appended to that route
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            // Select just the Category column, get distinct values, and sort alphabetically.
            // .Select(b => b.Category) — projects each Book into just its Category string
            // .Distinct() — removes duplicate category names
            // .OrderBy(c => c) — sorts alphabetically (A-Z)
            // .ToListAsync() — executes the query and returns the results as a List<string>
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
    }
}
