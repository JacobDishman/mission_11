// TypeScript INTERFACE — defines the shape of a Book object.
// This is used for type safety: if you try to access book.titl (typo), TypeScript catches it.
//
// IMPORTANT: Property names are camelCase (bookID, title, author, etc.)
// even though the C# model uses PascalCase (BookID, Title, Author, etc.).
// This is because ASP.NET Core's default JSON serializer (System.Text.Json) automatically
// converts PascalCase C# properties to camelCase when serializing to JSON.
//
// So the C# property "BookID" becomes "bookID" in the JSON response,
// and that's what we use here in TypeScript.
export interface Book {
    bookID: number;      // Maps to C# BookID (int) — the primary key
    title: string;       // Maps to C# Title (string)
    author: string;      // Maps to C# Author (string)
    publisher: string;   // Maps to C# Publisher (string)
    isbn: string;        // Maps to C# ISBN (string)
    classification: string; // Maps to C# Classification (string) — e.g., "Fiction", "Non-Fiction"
    category: string;    // Maps to C# Category (string) — e.g., "Biography", "Thrillers"
    pageCount: number;   // Maps to C# PageCount (int)
    price: number;       // Maps to C# Price (double) — stored as a floating-point number
}
