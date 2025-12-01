import { useEffect, useState } from 'react';
import { fetchAllBooks } from '../../services/booksService';
import type { IBook } from '../../types';
import BookCard from './components/BookCard';
import Spinner from '../../components/ui/Spinner';

const BooksListPage = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchAllBooks();
        setBooks(data);
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const filteredBooks = books
    .filter(book => 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Всі книги</h1>
        <input
          type="text"
          placeholder="🔍 Пошук за назвою або автором..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          Книг не знайдено 😔
        </div>
      )}
    </div>
  );
};

export default BooksListPage;