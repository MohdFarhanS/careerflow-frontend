import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB dalam bytes
const ACCEPTED_TYPES = ['application/pdf'];

export const documentSchema = z.object({
  file: z
    .instanceof(File, { message: 'File wajib dipilih.' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'Ukuran file maksimal 5MB.',
    })
    .refine((file) => ACCEPTED_TYPES.includes(file.type), {
      message: 'File harus berformat PDF.',
    }),
  document_type: z.enum(['cv', 'portfolio'], {
    errorMap: () => ({ message: 'Tipe dokumen wajib dipilih.' }),
  }),
});

export const portfolioUrlSchema = z
  .string()
  .min(1, { message: 'URL wajib diisi.' })
  .url({ message: 'URL tidak valid. Gunakan format https://...' });