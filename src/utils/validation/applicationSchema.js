import { z } from 'zod';

const APPLICATION_STATUSES = [
  'Applied',
  'Screening',
  'Technical Test',
  'Interview',
  'Offered',
  'Rejected',
];

export const applicationSchema = z.object({
  company_name: z
    .string()
    .min(1, 'Nama perusahaan wajib diisi.')
    .max(255),
  position: z
    .string()
    .min(1, 'Posisi wajib diisi.')
    .max(255),
  location: z.string().max(255).optional().or(z.literal('')),
  job_url: z
    .string()
    .url('Format URL tidak valid.')
    .optional()
    .or(z.literal('')),
  applied_date: z
    .string()
    .min(1, 'Tanggal melamar wajib diisi.'),
  salary_range: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(APPLICATION_STATUSES, {
    errorMap: () => ({ message: 'Status wajib dipilih.' }),
  }),
  notes: z.string().optional().or(z.literal('')),
});

export { APPLICATION_STATUSES };