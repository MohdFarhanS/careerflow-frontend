import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validation/authSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Handle Laravel validation errors (422)
      const laravelErrors = err?.response?.data?.errors;
      if (laravelErrors) {
        Object.entries(laravelErrors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
        return;
      }
      const message =
        err?.userMessage ?? err?.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.';
      setError('root', { message });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900">Buat akun baru</h1>
        <p className="mt-1 text-sm text-ink-500">
          Mulai lacak lamaranmu hari ini, gratis.
        </p>
      </div>

      {/* Global error */}
      {errors.root && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Nama Lengkap"
          type="text"
          placeholder="Nama Kamu"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 karakter, huruf kapital &amp; angka"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
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
          Buat Akun
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-ink-500">
        Sudah punya akun?{' '}
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