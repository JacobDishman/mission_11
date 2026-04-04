// CategoryFilter.tsx
// Sidebar component that shows all the book categories from the database.
// When you click one, it filters the book list to just that category.
// Clicking "All" shows everything again.

import { useState, useEffect } from 'react';

// Props this component expects from BookList
interface CategoryFilterProps {
    selectedCategory: string;                    // currently selected category ('' = all)
    onCategoryChange: (category: string) => void; // callback when user picks a category
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
    // Holds the list of categories fetched from the API
    const [categories, setCategories] = useState<string[]>([]);

    // Fetch categories once when the component loads
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5184';
                const response = await fetch(`${apiBase}/api/books/categories`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div>
            <h6 className="mb-2">Filter</h6>

            {/* Using Bootstrap list-group for the category buttons */}
            <div className="list-group list-group-flush">
                {/* "All" option to clear the filter */}
                <button
                    className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
                    onClick={() => onCategoryChange('')}
                >
                    All
                </button>

                {/* One button per category from the database */}
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
