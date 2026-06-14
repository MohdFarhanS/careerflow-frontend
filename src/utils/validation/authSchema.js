import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi.')
    .email('Format email tidak valid.'),
  password: z
    .string()
    .min(1, 'Password wajib diisi.'),
});

const passwordRules = z
  .string()
  .min(8, 'Password minimal 8 karakter.')
  .regex(/[A-Z]/, 'Password harus mengandung huruf kapital.')
  .regex(/[a-z]/, 'Password harus mengandung huruf kecil.')
  .regex(/[0-9]/, 'Password harus mengandung angka.');

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nama lengkap wajib diisi.')
      .max(255, 'Nama maksimal 255 karakter.'),
    email: z
      .string()
      .min(1, 'Email wajib diisi.')
      .email('Format email tidak valid.'),
    password: passwordRules,
    password_confirmation: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi password tidak cocok.',
    path: ['password_confirmation'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi.')
    .email('Format email tidak valid.'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordRules,
    password_confirmation: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi password tidak cocok.',
    path: ['password_confirmation'],
  });
