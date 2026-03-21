// Book interface — matches the JSON response from the ASP.NET Core API.
// Property names are camelCase because System.Text.Json converts PascalCase C# properties to camelCase.
export interface Book {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}
