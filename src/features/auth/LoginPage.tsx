import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import iziToast from 'izitoast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginUser(email, password);
      navigate('/books');
    } catch (err) {
      console.error(err); 
      iziToast.error({ title: 'Помилка', message: 'Невірний логін або пароль' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Вхід</h2>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <Input 
            label="Пароль" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <Button type="submit" isLoading={isLoading}>
            Увійти
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Немає акаунту? <Link to="/register" className="text-blue-600 hover:underline">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;