import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5184'}/api/books`;

const emptyBook: Book = {
    bookID: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
};

function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [formData, setFormData] = useState<Book>({ ...emptyBook });
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}?pageSize=1000`);
            const data = await response.json();
            setBooks(data.books);
        } catch (err) {
            setError('Failed to load books.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]:
                name === 'pageCount' || name === 'price'
                    ? Number(value)
                    : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingBook) {
                // UPDATE
                const response = await fetch(
                    `${API_URL}/${editingBook.bookID}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    }
                );
                if (!response.ok) throw new Error('Failed to update book.');
            } else {
                // CREATE
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) throw new Error('Failed to add book.');
            }

            setFormData({ ...emptyBook });
            setEditingBook(null);
            await fetchBooks();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEdit = (book: Book) => {
        setFormData({ ...book });
        setEditingBook(book);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (bookID: number) => {
        if (!window.confirm('Are you sure you want to delete this book?'))
            return;

        try {
            const response = await fetch(`${API_URL}/${bookID}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete book.');
            await fetchBooks();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setFormData({ ...emptyBook });
        setEditingBook(null);
    };

    return (
        <>
            <h1 className="mb-3">Admin - Manage Books</h1>
            <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => navigate('/')}
            >
                &larr; Back to Store
            </button>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Add / Edit Form */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">
                        {editingBook ? 'Edit Book' : 'Add New Book'}
                    </h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Publisher</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="publisher"
                                    value={formData.publisher}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">ISBN</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">
                                    Classification
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="classification"
                                    value={formData.classification}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">
                                    Page Count
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="pageCount"
                                    value={formData.pageCount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                        >
                            {editingBook ? 'Update Book' : 'Add Book'}
                        </button>
                        {editingBook && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Books Table */}
            <table className="table table-striped table-sm">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookID}>
                            <td>{book.bookID}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.isbn}</td>
                            <td>{book.category}</td>
                            <td>${book.price.toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(book)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(book.bookID)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default AdminBooksPage;
