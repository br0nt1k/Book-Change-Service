import { useState } from 'react';
import { getAllUsers, getUserBooks, removeBook, removeUserWithBooks } from '../../../services/adminService';
import { registerUser } from '../../../services/authService';
import type { IUser, IBook } from '../../../types';
import iziToast from 'izitoast';

export const useAdminActions = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserBooks, setSelectedUserBooks] = useState<IBook[] | null>(null);
  const [userNameForModal, setUserNameForModal] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
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

  const showUserBooks = async (uid: string, userEmail: string) => {
    setUserNameForModal(userEmail);
    try {
      const books = await getUserBooks(uid);
      setSelectedUserBooks(books);
    } catch (error) {
      console.error(error);
      iziToast.error({ title: 'Помилка', message: 'Не вдалося завантажити книги' });
    }
  };

  const deleteBookAction = (bookId: string) => {
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
            console.error(error)
            iziToast.error({ title: 'Помилка', message: 'Не вдалося видалити книгу' });
          }
        }, true],
        ['<button>Скасувати</button>', function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, false]
      ]
    });
  };

  const deleteUserFullyAction = (uid: string) => {
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
        ['<button><b>ВИДАЛИТИ</b></button>', async function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          try {
            const count = await removeUserWithBooks(uid);
            setUsers(prev => prev.filter(u => u.uid !== uid));
            iziToast.success({ title: 'Готово!', message: `Видалено юзера та ${count} книг.`, position: 'topRight' });
          } catch (error) {
            console.error(error)
            iziToast.error({ title: 'Помилка', message: 'Не вдалося видалити користувача' });
          }
        }, true],
        ['<button>Скасувати</button>', function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, false]
      ]
    });
  };

  const createUserAction = (email: string, pass: string, name: string) => {
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
            await registerUser(email, pass, name);
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

  return {
    users,
    loading,
    selectedUserBooks,
    userNameForModal,
    isAddUserOpen,
    setSelectedUserBooks,
    setIsAddUserOpen,
    loadUsers,
    showUserBooks,
    deleteBookAction,
    deleteUserFullyAction,
    createUserAction
  };
};