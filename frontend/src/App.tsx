// App.tsx — ROOT COMPONENT of the React application.
//
// Mission 12 additions:
//   - BrowserRouter: enables client-side routing (URL changes without page reload)
//   - CartProvider: wraps the entire app so all components can access cart state
//   - Routes: defines which component renders for each URL path
//
// The CartProvider MUST wrap Routes so that both BookList and CartPage
// can access the same cart state. If we moved CartProvider inside a route,
// navigating away would destroy the cart data.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import CartPage from './components/CartPage';

function App() {
    return (
        // BrowserRouter enables React Router to handle URL-based navigation.
        // It uses the HTML5 History API so the browser URL changes without
        // a full page reload (single-page application behavior).
        <BrowserRouter>
            {/* CartProvider wraps everything so cart state persists across navigation.
                When the user goes from /books to /cart, the cart data stays in memory. */}
            <CartProvider>
                {/* Bootstrap "container" centers content with responsive padding.
                    "mt-4" adds top margin for spacing from the browser chrome. */}
                <div className="container mt-4">
                    {/* Routes defines the URL-to-component mapping:
                        - "/" and "/books" both render BookList (the main store page)
                        - "/cart" renders CartPage (the shopping cart)
                        Having both "/" and "/books" ensures the app works whether
                        the user visits the root URL or the /books URL directly. */}
                    <Routes>
                        <Route path="/" element={<BookList />} />
                        <Route path="/books" element={<BookList />} />
                        <Route path="/cart" element={<CartPage />} />
                    </Routes>
                </div>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;
