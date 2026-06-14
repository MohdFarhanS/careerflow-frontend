import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { forgotPasswordSchema } from '../../utils/validation/authSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      await authService.getCsrfCookie();
      await authService.forgotPassword(data);
      setSubmitted(true);
    } catch (err) {
      const message =
        err?.userMessage ?? err?.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.';
      setError('root', { message });
    }
  };

  if (submitted) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink-900">Cek email kamu</h1>
          <p className="mt-1 text-sm text-ink-500">
            Jika email terdaftar, link reset password sudah dikirim. Periksa folder spam jika tidak muncul.
          </p>
        </div>
        <p className="text-center text-sm text-ink-500">
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            Kembali ke halaman login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900">Lupa password?</h1>
        <p className="mt-1 text-sm text-ink-500">
          Masukkan email akunmu dan kami akan mengirim link untuk reset password.
        </p>
      </div>

      {errors.root && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full"
        >
          Kirim Link Reset
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Ingat passwordnya?{' '}
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
