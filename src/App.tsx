import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import RegisterPage from './features/auth/RegisterPage';
import LoginPage from './features/auth/LoginPage';
import MyBooksPage from './features/my-books/MyBooksPage'; 
import BooksListPage from './features/books/BooksListPage';
import BookDetailsPage from './features/books/BookDetailsPage';
import AdminPage from './features/admin/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<BooksListPage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
          <Route path="me/books" element={<MyBooksPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;