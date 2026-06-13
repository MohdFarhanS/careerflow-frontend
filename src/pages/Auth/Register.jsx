import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validation/authSchema';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      setServerError(message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Buat Akun Baru</h1>
        <p className="mt-2 text-sm text-ink-500">
          Mulai lacak progres lamaran kerjamu dengan CareerFlow
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nama Lengkap"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

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
          placeholder="Minimal 8 karakter"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
          Daftar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Masuk
        </Link>
      </p>
    </div>
  );
}