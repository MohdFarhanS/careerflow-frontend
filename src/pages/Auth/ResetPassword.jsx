import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../api/authService';
import { resetPasswordSchema } from '../../utils/validation/authSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [succeeded, setSucceeded] = useState(false);

  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', password_confirmation: '' },
  });

  const onSubmit = async (data) => {
    try {
      await authService.resetPassword({ token, email, ...data });
      setSucceeded(true);
    } catch (err) {
      // 422: token expired/invalid atau validasi field
      const laravelErrors = err?.response?.data?.errors;
      if (laravelErrors) {
        Object.entries(laravelErrors).forEach(([field, messages]) => {
          const targetField = ['password', 'password_confirmation'].includes(field)
            ? field
            : 'root';
          setError(targetField, { message: messages[0] });
        });
        return;
      }
      const message =
        err?.userMessage ??
        err?.response?.data?.message ??
        'Terjadi kesalahan. Coba lagi.';
      setError('root', { message });
    }
  };

  if (!token || !email) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink-900">Link tidak valid</h1>
          <p className="mt-1 text-sm text-ink-500">
            Link reset password tidak valid atau sudah kadaluarsa.
          </p>
        </div>
        <p className="text-center text-sm text-ink-500">
          <Link
            to="/forgot-password"
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            Minta link baru
          </Link>
        </p>
      </div>
    );
  }

  if (succeeded) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink-900">Password berhasil direset</h1>
          <p className="mt-1 text-sm text-ink-500">
            Password kamu sudah diperbarui. Silakan login dengan password baru.
          </p>
        </div>
        <p className="text-center text-sm text-ink-500">
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900">Reset password</h1>
        <p className="mt-1 text-sm text-ink-500">
          Buat password baru untuk akun <span className="font-medium text-ink-700">{email}</span>.
        </p>
      </div>

      {errors.root && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Password Baru"
          type="password"
          placeholder="Min. 8 karakter, huruf kapital &amp; angka"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Konfirmasi Password Baru"
          type="password"
          placeholder="Ulangi password baru"
          required
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full"
        >
          Simpan Password Baru
        </Button>
      </form>
    </div>
  );
}
