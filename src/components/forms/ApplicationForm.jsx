import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { applicationSchema, APPLICATION_STATUSES } from '../../utils/validation/applicationSchema';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const REQUIRED_FIELDS = new Set(['company_name', 'position', 'applied_date', 'status']);

export default function ApplicationForm({ onSubmit, defaultValues, isLoading, fieldMeta = {} }) {
  const req = (name) => fieldMeta[name]?.required ?? REQUIRED_FIELDS.has(name);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultValues ?? {
      company_name: '',
      position: '',
      location: '',
      job_url: '',
      applied_date: new Date().toISOString().split('T')[0],
      salary_range: '',
      status: 'Applied',
      notes: '',
    },
  });

  // Reset form ketika defaultValues berubah (edit mode)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Row 1: Company + Position */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nama Perusahaan"
          placeholder="PT Tokopedia"
          required={req('company_name')}
          error={errors.company_name?.message}
          {...register('company_name')}
        />
        <Input
          label="Posisi"
          placeholder="Frontend Developer"
          required={req('position')}
          error={errors.position?.message}
          {...register('position')}
        />
      </div>

      {/* Row 2: Location + Applied Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Lokasi"
          placeholder="Jakarta / Remote"
          required={req('location')}
          error={errors.location?.message}
          {...register('location')}
        />
        <Input
          label="Tanggal Melamar"
          type="date"
          required={req('applied_date')}
          error={errors.applied_date?.message}
          {...register('applied_date')}
        />
      </div>

      {/* Row 3: Job URL + Salary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Link Lowongan"
          type="url"
          placeholder="https://..."
          required={req('job_url')}
          error={errors.job_url?.message}
          {...register('job_url')}
        />
        <Input
          label="Rentang Gaji"
          placeholder="5jt – 8jt"
          required={req('salary_range')}
          error={errors.salary_range?.message}
          {...register('salary_range')}
        />
      </div>

      {/* Status */}
      <Select
        label="Status"
        required={req('status')}
        error={errors.status?.message}
        {...register('status')}
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-700">
          Catatan
          {req('notes')
            ? <span className="ml-0.5 text-red-500">*</span>
            : <span className="ml-1 text-xs font-normal text-ink-400">(Opsional)</span>}
        </label>
        <textarea
          rows={3}
          placeholder="Catatan tambahan tentang lamaran ini..."
          className="w-full resize-none rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 outline-none transition-colors hover:border-ink-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          {...register('notes')}
        />
        {errors.notes && (
          <p className="text-xs text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Simpan
        </Button>
      </div>
    </form>
  );
}