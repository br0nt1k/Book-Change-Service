import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';

const Header = () => {
  const { user, role } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/books" className="text-xl font-bold">📚 BookExchange</Link>
        
        <nav className="space-x-4">
          <Link to="/books" className="hover:text-blue-200">Всі книги</Link>
          
          {user ? (
            <>
              <Link to="/me/books" className="hover:text-blue-200">Мої книги</Link>
              
              {role === 'Admin' && (
                <Link to="/admin" className="text-yellow-300 font-bold ml-2">Admin</Link>
              )}
              
              <button 
                onClick={() => auth.signOut()} 
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 ml-4"
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Увійти</Link>
              <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 ml-2">
                Реєстрація
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;