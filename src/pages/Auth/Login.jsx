import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validation/authSchema';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.';
      setError('root', { message });
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900">Selamat datang kembali</h1>
        <p className="mt-1 text-sm text-ink-500">
          Masuk untuk melanjutkan melacak lamaranmu.
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
          label="Email"
          type="email"
          placeholder="example@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full"
        >
          Masuk
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-ink-500">
        Belum punya akun?{' '}
        <Link
          to="/register"
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}