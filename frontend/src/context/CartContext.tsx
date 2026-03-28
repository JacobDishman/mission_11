// CartContext.tsx — CENTRAL STATE MANAGEMENT for the shopping cart.
//
// React Context API lets us share cart data across ALL components without
// passing props down through every level ("prop drilling"). Any component
// can access the cart by calling useCart().
//
// The cart state lives here in memory — it persists as long as the user
// doesn't refresh the page (session-level persistence). This is exactly
// what the assignment requires: "persist for the duration of the session."

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Book } from '../types/Book';
import type { CartItem } from '../types/CartItem';

// ============================================================
// RETURN PAGE STATE — tracks where the user was when they added
// an item to the cart, so "Continue Shopping" can bring them back.
// ============================================================
interface ReturnPage {
    pageNumber: number;
    pageSize: number;
    sortByTitle: boolean;
    category: string;
}

// ============================================================
// CONTEXT TYPE — defines all the values and functions that any
// component can access via useCart().
// ============================================================
interface CartContextType {
    cart: CartItem[];                                    // Array of items in the cart
    addToCart: (book: Book) => void;                     // Add a book (or increment quantity)
    removeFromCart: (bookID: number) => void;            // Remove an item entirely
    updateQuantity: (bookID: number, qty: number) => void; // Change quantity of an item
    clearCart: () => void;                               // Empty the entire cart
    cartTotal: number;                                   // Sum of all subtotals
    cartCount: number;                                   // Sum of all quantities
    returnPage: ReturnPage | null;                       // Where to go back to for "Continue Shopping"
    setReturnPage: (page: ReturnPage) => void;           // Save the current page state
}

// Create the context with undefined as default (will be provided by CartProvider)
const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================
// CART PROVIDER — wraps the app and provides cart state to all children.
// This component is placed in App.tsx around all routes.
// ============================================================
export const CartProvider = ({ children }: { children: ReactNode }) => {
    // The cart array holds all items. Each item has bookID, title, price, quantity, subtotal.
    const [cart, setCart] = useState<CartItem[]>([]);

    // Tracks the book list page state so "Continue Shopping" can restore it.
    const [returnPage, setReturnPage] = useState<ReturnPage | null>(null);

    // ADD TO CART — if the book is already in the cart, increment its quantity.
    // If it's new, add it with quantity 1.
    const addToCart = (book: Book) => {
        setCart((prevCart) => {
            // Check if this book is already in the cart
            const existingItem = prevCart.find((item) => item.bookID === book.bookID);

            if (existingItem) {
                // Book already in cart — increase quantity by 1 and recalculate subtotal.
                // .map() creates a new array (React requires immutable state updates).
                return prevCart.map((item) =>
                    item.bookID === book.bookID
                        ? {
                              ...item, // spread operator copies all existing properties
                              quantity: item.quantity + 1,
                              subtotal: (item.quantity + 1) * item.price,
                          }
                        : item
                );
            } else {
                // New book — add it to the cart with quantity 1.
                // [...prevCart, newItem] creates a new array with the new item appended.
                return [
                    ...prevCart,
                    {
                        bookID: book.bookID,
                        title: book.title,
                        price: book.price,
                        quantity: 1,
                        subtotal: book.price,
                    },
                ];
            }
        });
    };

    // REMOVE FROM CART — filter out the item with the given bookID.
    // .filter() returns a new array containing only items that DON'T match the bookID.
    const removeFromCart = (bookID: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.bookID !== bookID));
    };

    // UPDATE QUANTITY — set a specific quantity for an item.
    // If quantity drops to 0, remove the item entirely.
    const updateQuantity = (bookID: number, qty: number) => {
        if (qty <= 0) {
            removeFromCart(bookID);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.bookID === bookID
                    ? { ...item, quantity: qty, subtotal: qty * item.price }
                    : item
            )
        );
    };

    // CLEAR CART — reset to empty array
    const clearCart = () => setCart([]);

    // COMPUTED VALUES — derived from the cart array.
    // .reduce() iterates over all items and accumulates a single value.
    // For cartTotal: sum of all subtotals (what the user will pay).
    // For cartCount: sum of all quantities (total number of books).
    const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Provide all cart state and methods to child components
    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                returnPage,
                setReturnPage,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// ============================================================
// useCart HOOK — convenience function for accessing cart context.
// Instead of importing CartContext and calling useContext(CartContext),
// components just call useCart(). Also includes an error check.
// ============================================================
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        // This error means useCart() was called outside of <CartProvider>.
        // This should never happen if App.tsx is set up correctly.
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
