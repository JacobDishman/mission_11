// CartSummary.tsx
// This is the little cart button that sits in the top right of the bookstore page.
// It shows how many items are in the cart with a badge. When you click it,
// a Bootstrap Offcanvas panel slides in from the right showing a quick preview
// of your cart contents.
//
// Offcanvas is one of my new Bootstrap features for this assignment.
// It needs the Bootstrap JS bundle to work (imported in main.tsx).

import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
    const { cart, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <>
            {/* Cart button — data-bs-toggle tells Bootstrap to open the offcanvas */}
            <button
                className="btn btn-outline-secondary position-relative"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#cartOffcanvas"
            >
                Cart
                {/* Show a badge with item count if cart isn't empty */}
                {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                    </span>
                )}
            </button>

            {/* Offcanvas panel — slides in from the right side of the screen */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
                id="cartOffcanvas"
                aria-labelledby="cartOffcanvasLabel"
            >
                {/* Header with title + close button */}
                <div className="offcanvas-header">
                    <h5 id="cartOffcanvasLabel">Your Cart</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>

                {/* Body — show cart items or empty message */}
                <div className="offcanvas-body">
                    {cart.length === 0 ? (
                        <p className="text-muted">Nothing in your cart yet.</p>
                    ) : (
                        <>
                            {/* List out each item with qty and subtotal */}
                            <ul className="list-group mb-3">
                                {cart.map((item) => (
                                    <li
                                        key={item.bookID}
                                        className="list-group-item d-flex justify-content-between"
                                    >
                                        <div>
                                            <strong>{item.title}</strong><br />
                                            <small className="text-muted">
                                                {item.quantity} x ${item.price.toFixed(2)}
                                            </small>
                                        </div>
                                        <span>${item.subtotal.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Total */}
                            <div className="d-flex justify-content-between fw-bold mb-3">
                                <span>Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>

                            {/* Button to go to the full cart page.
                                We close the offcanvas first using Bootstrap's JS API,
                                then navigate. Otherwise the backdrop stays up. */}
                            <button
                                className="btn btn-primary w-100"
                                onClick={() => {
                                    // Close the offcanvas before navigating
                                    const el = document.getElementById('cartOffcanvas');
                                    if (el) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const instance = (window as any).bootstrap?.Offcanvas?.getInstance(el);
                                        instance?.hide();
                                    }
                                    navigate('/cart');
                                }}
                            >
                                Go to Cart
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSummary;
