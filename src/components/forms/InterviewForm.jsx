// src/components/forms/InterviewForm.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { interviewSchema } from '../../utils/validation/interviewSchema';
import { applicationService } from '../../api/applicationService';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

/**
 * Form untuk create & edit interview.
 * Prop `defaultValues` diisi saat mode edit.
 * Prop `onSubmit` menerima data yang sudah tervalidasi.
 * Prop `isSubmitting` untuk state loading tombol submit.
 * Prop `submitError` untuk banner error dari API.
 *
 * Form ini fetch list aplikasi user untuk dropdown application_id.
 * Tidak menerima prop aplikasi dari parent karena ini reusable form
 * yang bisa dipanggil dari mana saja.
 */
export default function InterviewForm({ defaultValues, onSubmit, isSubmitting, submitError }) {
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(interviewSchema),
        defaultValues: defaultValues ?? {
            application_id: '',
            interview_date: '',
            interview_time: '',
            interview_type: '',
            meeting_url: '',
            notes: '',
        },
    });

    // Fetch semua lamaran untuk dropdown — tanpa filter, tanpa pagination limit ketat
    // Kita ambil per_page besar karena user mungkin punya banyak lamaran
    useEffect(() => {
        let cancelled = false;
        applicationService.getAll({ sort: 'newest', per_page: 100 })
            .then((res) => {
                if (!cancelled) setApplications(res.data ?? []);
            })
            .catch(console.error)
            .finally(() => { if (!cancelled) setLoadingApps(false); });
        return () => { cancelled = true; };
    }, []);

    // Saat edit, application_id dari defaultValues bertipe number.
    // Select HTML hanya kenal string, jadi kita perlu setValue eksplisit
    // dengan konversi tipe supaya zodResolver tidak error.
    const handleApplicationChange = (e) => {
        const val = e.target.value;
        setValue('application_id', val ? parseInt(val, 10) : undefined, { shouldValidate: true });
    };

    // Hitung tanggal minimum dari lamaran yang dipilih.
    // interview_date tidak boleh sebelum applied_date lamaran terkait.
    // eslint-disable-next-line react-hooks/incompatible-library
    const watchedAppId = watch('application_id');
    const selectedApp = applications.find((a) => a.id === watchedAppId);
    const minDate = selectedApp?.applied_date ?? null;

    const formatDate = (dateStr) =>
        new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });

    const onFormSubmit = (formData) => {
        if (minDate && formData.interview_date < minDate) {
            setError('interview_date', {
                type: 'manual',
                message: `Tanggal interview tidak boleh sebelum tanggal lamaran (${formatDate(minDate)}).`,
            });
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-4">
            {/* Banner error dari API (bukan validasi form) */}
            {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            {/* Dropdown Lamaran */}
            <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">
                    Lamaran <span className="text-red-500">*</span>
                </label>
                <select
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    value={String(watch('application_id') ?? '')}
                    onChange={handleApplicationChange}
                    disabled={loadingApps || !!defaultValues}
                >
                    <option value="">
                        {loadingApps ? 'Memuat lamaran...' : 'Pilih lamaran'}
                    </option>
                    {applications.map((app) => (
                        <option key={app.id} value={app.id}>
                            {app.company_name} — {app.position}
                        </option>
                    ))}
                </select>
                {errors.application_id && (
                    <p className="mt-1 text-xs text-red-600">{errors.application_id.message}</p>
                )}
                {/* Saat edit, application tidak bisa diubah */}
                {defaultValues && (
                    <p className="mt-1 text-xs text-ink-400">
                        Lamaran tidak dapat diubah setelah interview dibuat.
                    </p>
                )}
            </div>

            {/* Tanggal & Jam — 2 kolom */}
            <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Tanggal Interview"
                        type="date"
                        required
                        min={minDate ?? undefined}
                        error={errors.interview_date?.message}
                        {...register('interview_date')}
                    />
                    <Input
                        label="Jam Interview"
                        type="time"
                        required
                        error={errors.interview_time?.message}
                        {...register('interview_time')}
                    />
                </div>
                {minDate && (
                    <p className="text-xs text-ink-400">
                        Tanggal interview minimal {formatDate(minDate)} (sesuai tanggal lamaran).
                    </p>
                )}
            </div>

            {/* Tipe Interview */}
            <Select
                label="Tipe Interview"
                required
                error={errors.interview_type?.message}
                {...register('interview_type')}
            >
                <option value="">Pilih tipe</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
            </Select>

            {/* Meeting URL — hanya relevan untuk Online */}
            <Input
                label="Link Meeting"
                type="url"
                placeholder="https://meet.google.com/..."
                error={errors.meeting_url?.message}
                {...register('meeting_url')}
            />

            {/* Catatan */}
            <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">
                    Catatan
                </label>
                <textarea
                    rows={3}
                    placeholder="Persiapan, hal yang perlu diingat, dll."
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    {...register('notes')}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    {defaultValues ? 'Simpan Perubahan' : 'Tambah Interview'}
                </Button>
            </div>
        </form>
    );
}