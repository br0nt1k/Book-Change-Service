import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await loginUser(email, password);
      navigate('/books');
    } catch (err) {
      console.error(err);
      setError('Невірний email або пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Вхід</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Увійти
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Немає акаунту? <Link to="/register" className="text-blue-600 hover:underline">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;