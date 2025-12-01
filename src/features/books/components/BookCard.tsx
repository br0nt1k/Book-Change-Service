import React from 'react';
import { Link } from 'react-router-dom';
import type { IBook } from '../../../types';

interface BookCardProps {
  book: IBook;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      
      {/* Картинка */}
      <div className="h-64 overflow-hidden bg-gray-50 relative group">
        <img 
          src={book.photoUrl} 
          alt={book.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Cover';
          }}
        />
      </div>

      {/* Інформація */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-1" title={book.name}>
          {book.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-1">
          ✍️ {book.author}
        </p>
        
        <Link 
          to={`/books/${book.id}`}
          className="mt-auto block w-full text-center bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
};

export default BookCard;