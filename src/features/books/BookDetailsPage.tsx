import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById, deleteBook } from '../../services/booksService';
import { useAuth } from '../../context/AuthContext';
import type { IBook } from '../../types';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Отримуємо ID книги з URL
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(true);

  // Завантаження даних книги
  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      try {
        const data = await fetchBookById(id);
        setBook(data);
      } catch (error) {
        console.error("Помилка завантаження книги:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  // Логіка кнопки "Запросити обмін"
  const handleExchange = () => {
    if (!book || !user) {
      alert("Будь ласка, увійдіть, щоб надіслати запит.");
      return;
    }

    // Формуємо тему та тіло листа
    const subject = `Запит на обмін книги: ${book.name}`;
    const body = `Привіт!\n\nМене зацікавила ваша книга "${book.name}".\n\nЯ пропоную обмін. Мої контакти: ${user.email}\n\nЗ повагою, користувач BookExchange.`;
    
    // Відкриваємо поштовий клієнт
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Логіка видалення
  const handleDelete = async () => {
    if (confirm('Ви точно хочете видалити цю книгу?') && id) {
      await deleteBook(id);
      navigate('/books'); // Повертаємось до списку після видалення
    }
  };

  if (loading) return <div className="text-center mt-10">Завантаження...</div>;
  if (!book) return <div className="text-center mt-10 text-red-500">Книгу не знайдено (404)</div>;

  // Перевірка: це моя книга?
  const isMyBook = user?.uid === book.ownerId;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row mt-6 border border-gray-100">
      
      {/* Ліва колонка: Фото */}
      <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-6 border-r border-gray-100">
        <img 
          src={book.photoUrl} 
          alt={book.name} 
          className="max-h-96 object-contain shadow-lg rounded"
          onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Cover'}
        />
      </div>

      {/* Права колонка: Інфо */}
      <div className="md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.name}</h1>
          <p className="text-xl text-gray-600 mb-6 flex items-center gap-2">
            ✍️ {book.author}
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
            Ця книга є у наявності. Власник готовий розглянути пропозиції обміну!
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {isMyBook ? (
            <button 
              onClick={handleDelete}
              className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold hover:bg-red-100 transition border border-red-200"
            >
              🗑 Видалити мою книгу
            </button>
          ) : (
            user ? (
              <button 
                onClick={handleExchange}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2"
              >
                📩 Запросити обмін
              </button>
            ) : (
              <div className="text-center text-gray-500 bg-gray-100 p-3 rounded">
                Увійдіть, щоб обмінятися
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// 👇 ОСЬ ЦЕЙ РЯДОК ВИПРАВЛЯЄ ПОМИЛКУ
export default BookDetailsPage;