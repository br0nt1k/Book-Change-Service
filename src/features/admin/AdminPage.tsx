import { useEffect, useState } from 'react';
import { registerUser } from '../../services/authService';
import { getAllUsers, getUserBooks, removeBook, removeUserWithBooks } from '../../services/adminService';
import type { IUser, IBook } from '../../types';
import iziToast from 'izitoast';
import Spinner from '../../components/ui/Spinner';

const AdminPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserBooks, setSelectedUserBooks] = useState<IBook[] | null>(null);
  const [userNameForModal, setUserNameForModal] = useState('');
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllUsers(); 
        setUsers(data);
      } catch (error) {
        console.error(error);
        iziToast.error({ title: 'Помилка', message: 'Не вдалося завантажити користувачів' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleShowBooks = async (uid: string, userEmail: string) => {
    setUserNameForModal(userEmail);
    try {
      const books = await getUserBooks(uid); 
      setSelectedUserBooks(books);
    } catch (error) {
      console.error(error);
      iziToast.error({ title: 'Помилка', message: 'Не вдалося завантажити книги' });
    }
  };

  const handleDeleteBook = (bookId: string) => {
    iziToast.question({
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: 1,
      id: 'delete-book',
      zindex: 9999,
      title: 'Видалити?',
      message: 'Видалити цю книгу назавжди?',
      position: 'center',
      buttons: [
        ['<button><b>Видалити</b></button>', async function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          
          try {
            await removeBook(bookId); 
            setSelectedUserBooks(prev => prev ? prev.filter(b => b.id !== bookId) : null);
            iziToast.info({ title: 'Видалено', message: 'Книгу успішно видалено', position: 'topRight' });
          } catch (error) {
            console.error(error);
            iziToast.error({ title: 'Помилка', message: 'Не вдалося видалити книгу' });
          }
        }, true],
        ['<button>Скасувати</button>', function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, false]
      ]
    });
  };

  const handleDeleteUserFully = (uid: string) => {
    iziToast.question({
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: 1,
      id: 'delete-user',
      zindex: 999,
      title: 'УВАГА!',
      message: 'Видалити користувача І ВСІ ЙОГО КНИГИ?',
      position: 'center',
      buttons: [
        ['<button><b>ВИДАЛИТИ ВСЕ</b></button>', async function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          
          try {
            const deletedBooksCount = await removeUserWithBooks(uid);
            
            setUsers(prev => prev.filter(u => u.uid !== uid));
            iziToast.success({ 
              title: 'Готово!', 
              message: `Користувача та ${deletedBooksCount} його книг видалено.`, 
              position: 'topRight' 
            });
          } catch (error) {
            console.error(error);
            iziToast.error({ title: 'Помилка', message: 'Не вдалося видалити користувача' });
          }
        }, true],
        ['<button>Скасувати</button>', function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, false]
      ]
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    iziToast.question({
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: 1,
      id: 'create-user',
      zindex: 999,
      title: 'Увага',
      message: 'Вас буде автоматично розлогінено. Створити?',
      position: 'center',
      buttons: [
        ['<button><b>Так</b></button>', async function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          try {
            await registerUser(newUserEmail, newUserPass, newUserName);
            iziToast.success({ title: 'Успішно!', message: 'Переадресація...', position: 'topCenter' });
          } catch (error) {
            if (error instanceof Error) iziToast.error({ title: 'Помилка', message: error.message });
          }
        }, true],
        ['<button>Скасувати</button>', function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, false]
      ]
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Адмін-панель</h1>
        <button onClick={() => setIsAddUserOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow">
          + Додати користувача
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Управління</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleShowBooks(user.uid, user.email || '')} className="text-blue-600 hover:text-blue-900 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50">Книги</button>
                  <button onClick={() => handleDeleteUserFully(user.uid)} className="text-red-600 hover:text-red-900 border border-red-200 px-3 py-1 rounded hover:bg-red-50">Видалити все</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUserBooks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Книги користувача: {userNameForModal}</h2>
              <button onClick={() => setSelectedUserBooks(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            {selectedUserBooks.length === 0 ? (
              <p className="text-gray-500">У цього користувача немає книг.</p>
            ) : (
              <div className="space-y-3">
                {selectedUserBooks.map(book => (
                  <div key={book.id} className="flex items-center justify-between border p-3 rounded hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img src={book.photoUrl} alt="" className="w-10 h-14 object-cover bg-gray-200 rounded" />
                      <div><p className="font-bold">{book.name}</p><p className="text-xs text-gray-500">{book.author}</p></div>
                    </div>
                    <button onClick={() => handleDeleteBook(book.id)} className="text-red-600 hover:text-red-800 text-sm font-bold">Видалити</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setSelectedUserBooks(null)} className="mt-6 w-full bg-gray-200 py-2 rounded hover:bg-gray-300">Закрити</button>
          </div>
        </div>
      )}

      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Новий користувач</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Ім'я" required className="w-full border p-2 rounded" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
              <input type="email" placeholder="Email" required className="w-full border p-2 rounded" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
              <input type="password" placeholder="Пароль" required className="w-full border p-2 rounded" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} />
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">Увага: Вас буде розлогінено.</div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Створити</button>
              <button type="button" onClick={() => setIsAddUserOpen(false)} className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300">Скасувати</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;