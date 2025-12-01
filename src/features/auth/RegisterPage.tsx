import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/authService';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    try {
      await registerUser(email, password, name);
      navigate('/books'); 
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError('Помилка реєстрації: ' + err.message);
      } else {
        setError('Сталася невідома помилка');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ім'я</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border rounded-md"
              value={name} onChange={(e) => setName(e.target.value)} required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="mt-1 block w-full p-2 border rounded-md"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input 
              type="password" 
              className="mt-1 block w-full p-2 border rounded-md"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Зареєструватися
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Вже є акаунт? <Link to="/login" className="text-blue-600 hover:underline">Увійти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;