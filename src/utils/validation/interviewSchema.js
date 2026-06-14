// src/utils/validation/interviewSchema.js
import { z } from 'zod';

export const interviewSchema = z.object({
    application_id: z
        .number({ invalid_type_error: 'Pilih lamaran terlebih dahulu.' })
        .int()
        .positive('Pilih lamaran terlebih dahulu.'),

    interview_date: z
        .string()
        .min(1, 'Tanggal interview wajib diisi.')
        .refine((val) => !isNaN(Date.parse(val)), 'Format tanggal tidak valid.'),

    interview_time: z
        .string()
        .min(1, 'Jam interview wajib diisi.')
        .regex(/^\d{2}:\d{2}$/, 'Format jam harus HH:MM.'),

    interview_type: z.enum(['Online', 'Offline'], {
        errorMap: () => ({ message: 'Pilih tipe interview.' }),
    }),

    meeting_url: z
        .string()
        .url('Format URL tidak valid.')
        .optional()
        .or(z.literal('')),

    notes: z.string().optional(),
});