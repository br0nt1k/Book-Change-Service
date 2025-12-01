import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import iziToast from 'izitoast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await registerUser(email, password, name);
      iziToast.success({ title: 'Вітаємо!', message: 'Акаунт створено' });
      navigate('/books'); 
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        iziToast.error({ title: 'Помилка', message: err.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input 
            label="Ім'я" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          
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
            Зареєструватися
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Вже є акаунт? <Link to="/login" className="text-blue-600 hover:underline">Увійти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;