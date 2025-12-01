import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { addBook } from '../../../services/booksService';

interface Props {
  onSuccess: () => void;
}

const AddBookForm: React.FC<Props> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true); 

    try {
      await addBook(name, author, photoUrl, user.uid);
      
      setLoading(false); 
      setName('');
      setAuthor('');
      setPhotoUrl('');
      onSuccess(); 
      
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Помилка при додаванні");
      setLoading(false); 
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Додати нову книгу</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Назва книги"
            className="border p-2 rounded w-full"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Автор"
            className="border p-2 rounded w-full"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
          />
        </div>
        
        <input
          type="url"
          placeholder="Посилання на фото (https://...)"
          className="border p-2 rounded w-full"
          value={photoUrl}
          onChange={e => setPhotoUrl(e.target.value)}
          required
        />
        
        {photoUrl && (
          <div className="w-20 h-28 bg-gray-100 rounded overflow-hidden">
            <img 
              src={photoUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} 
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className={`px-4 py-2 rounded text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Зберігаю...' : 'Зберегти книгу'}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;