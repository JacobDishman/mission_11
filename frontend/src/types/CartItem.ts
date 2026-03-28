// CartItem.ts — Defines the shape of an item in the shopping cart.
// Each CartItem represents one unique book in the cart, along with
// its quantity and calculated subtotal.

export interface CartItem {
    bookID: number;      // Unique identifier for the book (matches Book.bookID)
    title: string;       // Book title — displayed in the cart UI
    price: number;       // Price per unit (single book price)
    quantity: number;    // How many copies the user wants to buy
    subtotal: number;    // price * quantity — recalculated whenever quantity changes
}
