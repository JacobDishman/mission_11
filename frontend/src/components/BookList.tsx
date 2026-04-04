// BookList.tsx
// This is the main page of the bookstore app. It shows all the books,
// lets you filter by category, sort by title, paginate through results,
// and add books to your cart.
//
// Mission 12 stuff I added:
//   - Category filtering (sidebar on the left)
//   - Add to Cart buttons on each book
//   - Cart summary button in the top right (opens an offcanvas panel)
//   - Bootstrap Grid for the layout (row/col)
//   - Bootstrap Cards to display each book (instead of a boring table)
//   - Bootstrap Toast notification when you add something to the cart
//   - Reading URL params so "Continue Shopping" brings you back to the right page

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';
import CategoryFilter from './CategoryFilter';
import CartSummary from './CartSummary';

const BookList = () => {
    const navigate = useNavigate();
    // Read URL query params — this is how "Continue Shopping" restores your spot
    const [searchParams] = useSearchParams();

    // -- STATE --
    // All of these get re-read from URL params if you're coming back from the cart page
    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(
        Number(searchParams.get('pageNumber')) || 1
    );
    const [pageSize, setPageSize] = useState<number>(
        Number(searchParams.get('pageSize')) || 5
    );
    const [sortByTitle, setSortByTitle] = useState<boolean>(
        searchParams.get('sortByTitle') === 'true'
    );
    // Which category the user picked (empty string = show all)
    const [selectedCategory, setSelectedCategory] = useState<string>(
        searchParams.get('category') || ''
    );
    const [loading, setLoading] = useState<boolean>(true);

    // Toast state — controls the little green notification that pops up
    // when you add a book to the cart
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);

    // Get addToCart and setReturnPage from our cart context
    const { addToCart, setReturnPage } = useCart();

    // -- FETCH BOOKS FROM API --
    // This runs every time the page, page size, sort, or category changes.
    // It builds a URL with query params and calls our backend.
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                // Build the URL — only add category param if one is selected
                const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5184';
                let url = `${apiBase}/api/books?pageNumber=${pageNumber}&pageSize=${pageSize}&sortByTitle=${sortByTitle}`;
                if (selectedCategory) {
                    // encodeURIComponent handles spaces and special chars in category names
                    url += `&category=${encodeURIComponent(selectedCategory)}`;
                }

                const response = await fetch(url);
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
    }, [pageNumber, pageSize, sortByTitle, selectedCategory]);

    // Figure out how many pages there are based on the total count
    // (this changes when you filter by category since there are fewer books)
    const totalPages = Math.ceil(totalCount / pageSize);

    // -- EVENT HANDLERS --

    // When they change page size, go back to page 1
    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPageNumber(1);
    };

    // Toggle alphabetical sort on/off
    const handleSortToggle = () => {
        setSortByTitle(!sortByTitle);
        setPageNumber(1); // reset to page 1 since order changes
    };

    // When they click a category, filter and go back to page 1
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setPageNumber(1);
    };

    // Add a book to cart + save where we are so "Continue Shopping" works
    const handleAddToCart = (book: Book) => {
        addToCart(book);

        // Remember the current page state for "Continue Shopping"
        setReturnPage({
            pageNumber,
            pageSize,
            sortByTitle,
            category: selectedCategory,
        });

        // Show the toast notification for 3 seconds
        setToastMessage(`"${book.title}" added to cart!`);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    // Show a loading message while we wait for the API
    if (loading) {
        return <p className="text-center mt-4">Loading...</p>;
    }

    return (
        <div>
            {/* Header — store name on left, cart button on right */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Hilton's Bookstore</h2>
                <div>
                    <button className="btn btn-outline-primary me-2" onClick={() => navigate('/adminbooks')}>Admin</button>
                    <CartSummary />
                </div>
            </div>

            <hr />

            {/* Main layout using Bootstrap Grid — sidebar + content area */}
            <div className="row">

                {/* Sidebar — takes up 2 columns on medium+ screens */}
                <div className="col-md-2 mb-3">
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                {/* Main content — takes up the rest (10 columns) */}
                <div className="col-md-10">

                    {/* Sort button + results per page dropdown */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            className={`btn btn-sm ${sortByTitle ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={handleSortToggle}
                        >
                            {sortByTitle ? 'Sorted A-Z' : 'Sort by Title'}
                        </button>

                        <div className="d-flex align-items-center">
                            <label htmlFor="pageSize" className="me-2 mb-0" style={{ fontSize: '0.9rem' }}>
                                Show:
                            </label>
                            <select
                                id="pageSize"
                                className="form-select form-select-sm"
                                style={{ width: '70px' }}
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
                    </div>

                    {/* Book cards — using Bootstrap Cards (one of my new bootstrap features) */}
                    <div className="row">
                        {books.map((book) => (
                            <div key={book.bookID} className="col-sm-6 col-lg-4 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h6 className="card-title">{book.title}</h6>
                                        <p className="card-subtitle mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                            by {book.author}
                                        </p>
                                        <p className="card-text" style={{ fontSize: '0.85rem' }}>
                                            Publisher: {book.publisher}<br />
                                            ISBN: {book.isbn}<br />
                                            Classification: {book.classification}<br />
                                            Category: {book.category}<br />
                                            Pages: {book.pageCount}
                                        </p>
                                        <p className="fw-bold mb-2">${book.price.toFixed(2)}</p>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleAddToCart(book)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination — dynamically generated based on how many books match */}
                    <nav className="mt-2">
                        <ul className="pagination pagination-sm justify-content-center">
                            {/* Previous button */}
                            <li className={`page-item ${pageNumber === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPageNumber(pageNumber - 1)}
                                    disabled={pageNumber === 1}
                                >
                                    Prev
                                </button>
                            </li>

                            {/* Page number buttons — generated dynamically from totalPages */}
                            {[...Array(totalPages)].map((_, i) => (
                                <li
                                    key={i + 1}
                                    className={`page-item ${pageNumber === i + 1 ? 'active' : ''}`}
                                >
                                    <button className="page-link" onClick={() => setPageNumber(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next button */}
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

                    {/* Little info line at the bottom */}
                    <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>
                        Page {pageNumber} of {totalPages} — {totalCount} books
                        {selectedCategory && ` in "${selectedCategory}"`}
                    </p>
                </div>
            </div>

            {/* BOOTSTRAP TOAST — pops up in the bottom right when you add a book.
                I'm controlling visibility with React state (showToast) instead of
                Bootstrap's JS API because it's simpler and more reliable.
                The "show" class makes it visible. Without it, the toast is hidden. */}
            {showToast && (
                <div
                    className="position-fixed bottom-0 end-0 p-3"
                    style={{ zIndex: 1055 }}
                >
                    <div className="toast show align-items-center text-bg-success border-0">
                        <div className="d-flex">
                            <div className="toast-body">
                                {toastMessage}
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                onClick={() => setShowToast(false)}
                            ></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;
