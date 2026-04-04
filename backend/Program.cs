// Program.cs is the ENTRY POINT of the ASP.NET Core application.
// It configures all services (dependency injection), middleware, and starts the web server.
// In .NET 6+, this uses "top-level statements" — no Main() method or class needed.

using Microsoft.EntityFrameworkCore;
using Mission11.API.Data;

// ============================================================
// STEP 1: Create the application builder
// ============================================================
// WebApplication.CreateBuilder() sets up the hosting environment, configuration
// (appsettings.json, environment variables), logging, and the DI container.
var builder = WebApplication.CreateBuilder(args);

// ============================================================
// STEP 2: Register services with the Dependency Injection (DI) container
// ============================================================
// Services are classes that your app depends on. Registering them here means
// ASP.NET Core will automatically create and inject them where needed.

// AddControllers() registers the MVC controller services so ASP.NET Core
// knows to look for classes like BooksController and route HTTP requests to them.
builder.Services.AddControllers();

// AddOpenApi() enables the OpenAPI (Swagger-like) endpoint for API documentation.
// In development, you can visit /openapi/v1.json to see your API spec.
builder.Services.AddOpenApi();

// AddDbContext<BookstoreContext>() registers our EF Core database context.
// This tells the DI container: "When someone asks for a BookstoreContext,
// create one configured to use SQLite with this connection string."
//
// The connection string "Data Source=Bookstore.sqlite" tells SQLite to look for
// a file called Bookstore.sqlite in the project's working directory (backend/).
// This connection string is stored in appsettings.json under "ConnectionStrings".
// Use SQL Server if a connection string named "DefaultConnection" is provided (Azure),
// otherwise fall back to SQLite for local development.
var sqlServerConnection = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(sqlServerConnection))
{
    builder.Services.AddDbContext<BookstoreContext>(options =>
        options.UseSqlServer(sqlServerConnection));
}
else
{
    builder.Services.AddDbContext<BookstoreContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));
}

// ============================================================
// STEP 3: Configure CORS (Cross-Origin Resource Sharing)
// ============================================================
// CORS is a browser security feature. By default, a web page at http://localhost:5173
// (our React frontend) CANNOT make API calls to http://localhost:5184 (our backend)
// because they are different "origins" (different ports = different origins).
//
// We must explicitly tell the backend: "Allow requests from http://localhost:5173."
// Without this, the browser will block all fetch() calls from the frontend and you'll
// see CORS errors in the browser console.
//
// AllowAnyHeader() = accept any HTTP headers (Content-Type, Authorization, etc.)
// AllowAnyMethod() = accept any HTTP methods (GET, POST, PUT, DELETE, etc.)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173",
                           "https://localhost:5173")
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });

    // Separate policy for Azure — the actual URL gets added after deployment
    options.AddPolicy("AllowAzure", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ============================================================
// STEP 4: Build the application
// ============================================================
// This finalizes all the service registrations and creates the WebApplication instance.
var app = builder.Build();

// ============================================================
// STEP 5: Configure the HTTP request pipeline (middleware)
// ============================================================
// Middleware are functions that process each HTTP request in order.
// The order matters! Each request flows through these in sequence.

// Only enable OpenAPI docs in development (not in production)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Apply the CORS policy we defined above. This MUST come before MapControllers()
// so that CORS headers are added to responses before the controller handles the request.
// Use the Azure CORS policy in production, local policy in development
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowReactApp");
}
else
{
    app.UseCors("AllowAzure");
}

// Redirect HTTP requests to HTTPS for security
app.UseHttpsRedirection();

// Enable authorization middleware (even though we don't use auth in this app,
// it's standard practice to include it in the pipeline)
app.UseAuthorization();

// Map controller routes — this tells ASP.NET Core to scan for [ApiController] classes
// and wire up their [HttpGet], [HttpPost], etc. attributes to URL routes.
// For our BooksController with [Route("api/[controller]")], this creates the route /api/books.
app.MapControllers();

// Start the web server and begin listening for HTTP requests.
// This is a blocking call — the app runs until you press Ctrl+C or stop the process.
app.Run();
