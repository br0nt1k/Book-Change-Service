import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchMyBooks, deleteBook } from '../../services/booksService';
import { toast, confirmAction } from '../../utils/toast'; 
import type { IBook } from '../../types';
import AddBookForm from './components/AddBookForm';
import Spinner from '../../components/ui/Spinner';

const MyBooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    if (user) {
      try {
        const data = await fetchMyBooks(user.uid);
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleDelete = (id: string) => {
    confirmAction('Ви впевнені, що хочете видалити цю книгу?', async () => {
      await deleteBook(id);
      toast.success('Книгу видалено');
      loadBooks();
    });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Мої книги</h1>
      <AddBookForm onSuccess={loadBooks} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow p-4 flex gap-4 border">
            <img 
              src={book.photoUrl} alt={book.name} 
              className="w-24 h-36 object-cover rounded bg-gray-200"
            />
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-lg font-bold">{book.name}</h3>
                <p className="text-gray-600">{book.author}</p>
              </div>
              <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-800 text-sm self-start mt-2 border border-red-200 px-3 py-1 rounded">
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
      {books.length === 0 && (
        <p className="text-center text-gray-500 mt-10">У вас поки немає доданих книг.</p>
      )}
    </div>
  );
};

export default MyBooksPage;