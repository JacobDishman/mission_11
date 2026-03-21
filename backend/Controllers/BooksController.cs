using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11.API.Data;

namespace Mission11.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // GET api/books?pageNumber=1&pageSize=5&sortByTitle=false
        // Returns a paginated list of books with the total count for frontend pagination.
        [HttpGet]
        public async Task<IActionResult> GetBooks(
            int pageNumber = 1,
            int pageSize = 5,
            bool sortByTitle = false)
        {
            var query = _context.Books.AsQueryable();

            // Optionally sort alphabetically by title
            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalCount = await query.CountAsync();

            // Apply pagination: skip previous pages, take current page size
            var books = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { books, totalCount });
        }
    }
}
