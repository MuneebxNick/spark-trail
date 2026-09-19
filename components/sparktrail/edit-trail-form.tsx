'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateTrailSchema, type UpdateTrailInput } from '@/lib/validations/trail'
import { updateTrail } from '@/actions/trails'
import { useRouter } from 'next/navigation'
import { useRouteTransition } from '@/components/animations/route-transition'
import { useToast } from '@/components/sparktrail/toast'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import {
  CheckCircle2,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
  Tag,
  AlignLeft,
  Compass,
} from 'lucide-react'
import type { Trail } from '@prisma/client'

interface EditTrailFormProps {
  trail: Trail
}

export function EditTrailForm({ trail }: EditTrailFormProps) {
  const router = useRouter()
  const { transitionTo } = useRouteTransition()
  const { toast } = useToast()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateTrailInput>({
    resolver: zodResolver(updateTrailSchema),
    defaultValues: {
      id: trail.id,
      title: trail.title,
      description: trail.description || '',
      category: trail.category || '',
      status: trail.status,
      isPublic: Boolean(trail.isPublic),
    },
  })

  // Ensure it's treated as a boolean regardless of string cast
  const isPublicWatch = watch('isPublic')
  const isPublicValue = isPublicWatch === true || String(isPublicWatch) === 'true'
  const descriptionValue = watch('description') || ''

  const onSubmit = async (data: UpdateTrailInput) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setServerError(null)

    try {
      const payload: UpdateTrailInput = {
        id: trail.id,
        title: data.title.trim(),
        description: data.description ? data.description.trim() : null,
        category: data.category ? data.category.trim() : null,
        status: trail.status,
        isPublic: isPublicValue,
      }

      const result = await updateTrail(payload)

      if (result.success) {
        toast('Trail updated successfully.', 'success')
        router.refresh()
        transitionTo(`/trails/${trail.id}`)
      } else {
        setServerError(result.error || 'Failed to update trail.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Error submitting trail update:', err)
      setServerError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <StaggerContainer className="mx-auto max-w-2xl space-y-12">
      <StaggerItem className="space-y-4 text-center sm:text-left">
        <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[42px]">
          Edit Trail
        </h1>
        <p className="text-[15px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
          Update the overarching details of your journey.
        </p>
      </StaggerItem>

      <StaggerItem>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {serverError && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-50/50 dark:bg-red-500/10 p-4 text-[13.5px] text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-3">
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] uppercase tracking-[0.05em]"
            >
              <Compass className="h-4 w-4 text-[#7857FF]" />
              Trail Title
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                {...register('title')}
                className="w-full rounded-2xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-5 py-4 text-[16px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#111111]/40 dark:placeholder:text-[#FFFFFF]/40 focus:border-[#7857FF]/50 focus:outline-none focus:ring-4 focus:ring-[#7857FF]/10 transition-all"
                placeholder="What are you building or learning?"
              />
            </div>
            {errors.title && (
              <p className="text-[12px] text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="flex items-center gap-2 text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] uppercase tracking-[0.05em]"
              >
                <AlignLeft className="h-4 w-4 text-[#7857FF]" />
                Description (Optional)
              </label>
              <span
                className={`text-[11px] font-medium ${
                  descriptionValue.length > 480
                    ? 'text-red-500'
                    : 'text-[#737373] dark:text-[#A1A1AA]'
                }`}
              >
                {descriptionValue.length}/500
              </span>
            </div>
            <textarea
              id="description"
              rows={3}
              {...register('description')}
              className="w-full resize-none rounded-2xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-5 py-4 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#111111]/40 dark:placeholder:text-[#FFFFFF]/40 focus:border-[#7857FF]/50 focus:outline-none focus:ring-4 focus:ring-[#7857FF]/10 transition-all"
              placeholder="Briefly describe your goals for this trail..."
            />
            {errors.description && (
              <p className="text-[12px] text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Input */}
          <div className="space-y-3">
            <label
              htmlFor="category"
              className="flex items-center gap-2 text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] uppercase tracking-[0.05em]"
            >
              <Tag className="h-4 w-4 text-[#7857FF]" />
              Category (Optional)
            </label>
            <input
              id="category"
              type="text"
              {...register('category')}
              className="w-full rounded-2xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-5 py-4 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#111111]/40 dark:placeholder:text-[#FFFFFF]/40 focus:border-[#7857FF]/50 focus:outline-none focus:ring-4 focus:ring-[#7857FF]/10 transition-all"
              placeholder="e.g. Design, Frontend, Machine Learning"
            />
            {errors.category && (
              <p className="text-[12px] text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Visibility Toggle */}
          <div className="space-y-4 rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-[#111111]/[0.02] dark:bg-white/[0.02] p-5">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] uppercase tracking-[0.05em]">
                Visibility
              </h3>
            </div>
            <input type="hidden" {...register('isPublic')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('isPublic', true, { shouldValidate: true, shouldDirty: true })}
                className={`relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  isPublicValue
                    ? 'border-[#7857FF] bg-[#7857FF]/5'
                    : 'border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] hover:border-[#7857FF]/30'
                }`}
                aria-pressed={isPublicValue}
              >
                <Globe
                  className={`h-5 w-5 ${
                    isPublicValue
                      ? 'text-[#7857FF]'
                      : 'text-[#737373] dark:text-[#A1A1AA]'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                    Public
                  </p>
                  <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                    Visible on community feed
                  </p>
                </div>
                {isPublicValue && (
                  <CheckCircle2 className="h-5 w-5 text-[#7857FF]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setValue('isPublic', false, { shouldValidate: true, shouldDirty: true })}
                className={`relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  !isPublicValue
                    ? 'border-[#7857FF] bg-[#7857FF]/5'
                    : 'border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] hover:border-[#7857FF]/30'
                }`}
                aria-pressed={!isPublicValue}
              >
                <Lock
                  className={`h-5 w-5 ${
                    !isPublicValue
                      ? 'text-[#7857FF]'
                      : 'text-[#737373] dark:text-[#A1A1AA]'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                    Private
                  </p>
                  <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                    Only visible to you
                  </p>
                </div>
                {!isPublicValue && (
                  <CheckCircle2 className="h-5 w-5 text-[#7857FF]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#111111]/[0.08] dark:border-white/10">
            <button
              type="button"
              onClick={() => transitionTo(`/trails/${trail.id}`)}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full border border-[#111111]/10 dark:border-white/10 bg-transparent px-6 py-3.5 text-[14px] font-semibold text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7857FF] px-8 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_-4px_rgba(120,87,255,0.4)] hover:bg-[#6842FF] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <Compass className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </StaggerItem>
    </StaggerContainer>
  )
}
