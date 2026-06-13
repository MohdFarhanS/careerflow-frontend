import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validation/authSchema';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Email atau password salah.';
      setServerError(message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Selamat Datang Kembali</h1>
        <p className="mt-2 text-sm text-ink-500">
          Masuk untuk melanjutkan ke dashboard CareerFlow
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Masukkan password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
          Masuk
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Daftar di sekarang
        </Link>
      </p>
    </div>
  );
}