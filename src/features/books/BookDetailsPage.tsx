import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById, deleteBook } from '../../services/booksService';
import { prepareExchangeData } from '../../services/exchangeService'; 
import { useAuth } from '../../context/AuthContext';
import { toast, confirmAction } from '../../utils/toast'; 
import type { IBook } from '../../types';
import Spinner from '../../components/ui/Spinner';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      try {
        const data = await fetchBookById(id);
        setBook(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  const handleExchange = async () => {
    if (!book || !user) {
      toast.warning('Будь ласка, увійдіть, щоб надіслати запит');
      return;
    }

    setIsSending(true);

    try {
      const { ownerEmail, myBooksList } = await prepareExchangeData(book, user.uid);

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(`Лист для ${ownerEmail}: \n${myBooksList}`);
      toast.success(`Запит сформовано для ${ownerEmail}`);

    } catch (error) {
      if (error instanceof Error) {
        toast.warning(error.message);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;

    confirmAction('Видалити цю книгу?', async () => {
      await deleteBook(id);
      toast.info('Книгу видалено');
      navigate('/books');
    });
  };

  if (loading) return <Spinner />;
  if (!book) return <div className="text-center mt-10">Книгу не знайдено</div>;
  const isMyBook = user?.uid === book.ownerId;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row mt-6 border border-gray-100">
      <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-6 border-r border-gray-100">
        <img 
          src={book.photoUrl} alt={book.name} 
          className="max-h-96 object-contain shadow-lg rounded"
          onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Cover'}
        />
      </div>

      <div className="md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.name}</h1>
          <p className="text-xl text-gray-600 mb-6">✍️ {book.author}</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
            Власник готовий розглянути пропозиції обміну!
          </div>
        </div>

        <div className="mt-8">
          {isMyBook ? (
            <button onClick={handleDelete} className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold hover:bg-red-100 border border-red-200 transition">
              🗑 Видалити мою книгу
            </button>
          ) : (
            <button 
              onClick={handleExchange}
              disabled={isSending}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition flex justify-center items-center gap-2 ${
                isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSending ? 'Відправка...' : '📩 Запросити обмін (Email)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;