// CartPage.tsx
// The full cart page — shows everything in the cart with quantity controls,
// subtotals, and a total. You can also continue shopping (goes back to
// whatever page you were on) or clear the whole cart.

import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    // Pull everything we need from the cart context
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, returnPage } = useCart();
    const navigate = useNavigate();

    // When they click "Continue Shopping", build a URL with query params
    // so we can take them back to the exact page they were on before
    const handleContinueShopping = () => {
        if (returnPage) {
            const params = new URLSearchParams();
            params.set('pageNumber', returnPage.pageNumber.toString());
            params.set('pageSize', returnPage.pageSize.toString());
            params.set('sortByTitle', returnPage.sortByTitle.toString());
            if (returnPage.category) {
                params.set('category', returnPage.category);
            }
            navigate(`/books?${params.toString()}`);
        } else {
            navigate('/books');
        }
    };

    return (
        <div>
            <h2 className="mb-4">Your Cart</h2>

            {cart.length === 0 ? (
                // Empty cart
                <div>
                    <p className="text-muted">Your cart is empty.</p>
                    <button className="btn btn-outline-primary" onClick={() => navigate('/books')}>
                        Go Shopping
                    </button>
                </div>
            ) : (
                <>
                    {/* Cart items table */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.bookID}>
                                    <td>{item.title}</td>
                                    <td>${item.price.toFixed(2)}</td>

                                    {/* Plus/minus buttons to change quantity */}
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-1"
                                            onClick={() => updateQuantity(item.bookID, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        {item.quantity}
                                        <button
                                            className="btn btn-sm btn-outline-secondary ms-1"
                                            onClick={() => updateQuantity(item.bookID, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </td>

                                    <td>${item.subtotal.toFixed(2)}</td>

                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeFromCart(item.bookID)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Total */}
                    <div className="text-end mb-3">
                        <strong>Total: ${cartTotal.toFixed(2)}</strong>
                    </div>

                    {/* Action buttons */}
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary" onClick={handleContinueShopping}>
                            Continue Shopping
                        </button>
                        <button className="btn btn-outline-danger" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
