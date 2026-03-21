import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';

const BookList = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [sortByTitle, setSortByTitle] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch books from the API whenever pagination or sorting state changes
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5184/api/books?pageNumber=${pageNumber}&pageSize=${pageSize}&sortByTitle=${sortByTitle}`
                );
                const data = await response.json();
                setBooks(data.books);
                setTotalCount(data.totalCount);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [pageNumber, pageSize, sortByTitle]);

    // Calculate total pages dynamically based on total book count and current page size
    const totalPages = Math.ceil(totalCount / pageSize);

    // Handle page size change — reset to page 1 when the user picks a new size
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPageNumber(1);
    };

    // Toggle sort by title — reset to page 1 when sorting changes
    const handleSortToggle = () => {
        setSortByTitle(!sortByTitle);
        setPageNumber(1);
    };

    if (loading) {
        return <p className="text-center mt-4">Loading books...</p>;
    }

    return (
        <div>
            <h1 className="text-center mb-4">Online Bookstore</h1>

            {/* Controls row: sort toggle and page size selector */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Sort by title toggle button */}
                <button
                    className={`btn ${sortByTitle ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={handleSortToggle}
                >
                    {sortByTitle ? 'Sorting by Title (On)' : 'Sort by Title'}
                </button>

                {/* Page size selector */}
                <div className="d-flex align-items-center">
                    <label htmlFor="pageSize" className="me-2 mb-0">
                        Results per page:
                    </label>
                    <select
                        id="pageSize"
                        className="form-select w-auto"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                </div>
            </div>

            {/* Book table with Bootstrap styling */}
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Page Count</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookID}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.classification}</td>
                            <td>{book.category}</td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination controls — dynamically generated based on totalPages */}
            <nav>
                <ul className="pagination justify-content-center">
                    {/* Previous button — disabled on first page */}
                    <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => setPageNumber(pageNumber - 1)}
                            disabled={pageNumber === 1}
                        >
                            Previous
                        </button>
                    </li>

                    {/* Dynamically generate a button for each page */}
                    {[...Array(totalPages)].map((_, i) => (
                        <li
                            key={i + 1}
                            className={`page-item ${pageNumber === i + 1 ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setPageNumber(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    {/* Next button — disabled on last page */}
                    <li className={`page-item ${pageNumber === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => setPageNumber(pageNumber + 1)}
                            disabled={pageNumber === totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Page info */}
            <p className="text-center text-muted">
                Page {pageNumber} of {totalPages} &mdash; {totalCount} total books
            </p>
        </div>
    );
};

export default BookList;
