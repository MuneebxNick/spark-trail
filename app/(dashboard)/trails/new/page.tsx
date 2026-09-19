'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createTrailSchema,
  type CreateTrailInput,
} from '@/lib/validations/trail'
import { createTrail } from '@/actions/trails'
import {
  useRouteTransition,
  TransitionLink,
} from '@/components/animations/route-transition'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { ArrowLeft, Sparkles, Lock, Globe, Loader2 } from 'lucide-react'

const STATUS_OPTIONS: {
  value: 'LEARNING' | 'BUILDING' | 'STUCK' | 'WIN'
  label: string
  desc: string
  colorClass: string
}[] = [
    {
      value: 'BUILDING',
      label: 'BUILDING',
      desc: 'Hands-on construction & coding',
      colorClass: 'bg-[#C7FF3D] text-[#111111]',
    },
    {
      value: 'LEARNING',
      label: 'LEARNING',
      desc: 'Researching concepts & syntax',
      colorClass: 'bg-[#7857FF] text-white',
    },
    {
      value: 'STUCK',
      label: 'STUCK',
      desc: 'Debugging a blocker or limitation',
      colorClass: 'bg-[#111111] text-[#F6F5EF]',
    },
    {
      value: 'WIN',
      label: 'WIN',
      desc: 'Shipped a version or key milestone',
      colorClass: 'bg-[#C7FF3D] text-[#111111]',
    },
  ]

export default function NewTrailPage() {
  const { transitionTo } = useRouteTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTrailInput>({
    resolver: zodResolver(createTrailSchema),
    defaultValues: {
      status: 'BUILDING',
      isPublic: true,
      category: '',
      description: '',
    },
  })

  const selectedStatus = watch('status')
  const isPublic = watch('isPublic')

  const onSubmit = async (data: CreateTrailInput) => {
    if (isSubmitting) return
    setServerError(null)
    setIsSubmitting(true)

    try {
      const res = await createTrail(data)
      if (res.success && res.trailId) {
        transitionTo(`/trails/${res.trailId}`)
      } else {
        setServerError(res.error || 'Failed to create trail.')
        setIsSubmitting(false)
      }
    } catch {
      setServerError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <StaggerContainer delay={0.08} stagger={0.08} className="mx-auto max-w-2xl space-y-8">
      {/* 1. Back Link Header */}
      <StaggerItem y={8}>
        <TransitionLink
          href="/trails"
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to studio</span>
        </TransitionLink>
      </StaggerItem>

      {/* 2. Eyebrow Tagline */}
      <StaggerItem y={10}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#7857FF]" />
          <span className="font-heading text-[11.5px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
            Create Studio Trail
          </span>
        </div>
      </StaggerItem>

      {/* 3. Main Heading */}
      <StaggerItem y={12}>
        <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[40px]">
          Start a new trail.
        </h1>
      </StaggerItem>

      {/* 4. Supporting Description */}
      <StaggerItem y={12}>
        <p className="text-[15px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
          Trails organize your progress around a specific project, skill, or breakthrough.
          Log your updates as you build &mdash; step by step.
        </p>
      </StaggerItem>

      <StaggerItem y={8}>
        <hr className="border-[#111111]/[0.08] dark:border-white/10" />
      </StaggerItem>

      {/* 5. Main Creation Form Card */}
      <StaggerItem y={14}>
        <div className="rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-7 md:p-9 shadow-[0_10px_35px_-15px_rgba(17,17,17,0.06)] dark:shadow-[0_10px_35px_-15px_rgba(0,0,0,0.5)] transition-colors">
          {serverError && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-[13.5px] text-red-600 dark:text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors">
                Trail Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                {...register('title')}
                placeholder="e.g. Building SparkTrail Core Engine"
                className="mt-2 h-11 w-full rounded-xl border border-[#111111]/15 dark:border-white/15 bg-transparent px-4 text-[14px] text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#8A8A8A] dark:placeholder:text-[#71717A] focus:border-[#7857FF] focus:ring-1 focus:ring-[#7857FF]/20 focus:outline-none transition-colors disabled:opacity-60"
              />
              {errors.title && (
                <p className="mt-1.5 text-[12px] text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors">
                Category / Domain <span className="text-[#8A8A8A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                {...register('category')}
                placeholder="e.g. Next.js, Rust, System Design, Product"
                className="mt-2 h-11 w-full rounded-xl border border-[#111111]/15 dark:border-white/15 bg-transparent px-4 text-[14px] text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#8A8A8A] dark:placeholder:text-[#71717A] focus:border-[#7857FF] focus:ring-1 focus:ring-[#7857FF]/20 focus:outline-none transition-colors disabled:opacity-60"
              />
              {errors.category && (
                <p className="mt-1.5 text-[12px] text-red-500">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors">
                Description & Goal <span className="text-[#8A8A8A] font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                disabled={isSubmitting}
                {...register('description')}
                placeholder="Briefly describe what you're working toward on this trail..."
                className="mt-2 w-full rounded-xl border border-[#111111]/15 dark:border-white/15 bg-transparent p-4 text-[14px] text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#8A8A8A] dark:placeholder:text-[#71717A] focus:border-[#7857FF] focus:ring-1 focus:ring-[#7857FF]/20 focus:outline-none transition-colors resize-none disabled:opacity-60"
              />
              {errors.description && (
                <p className="mt-1.5 text-[12px] text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors mb-2.5">
                Initial Progress Status
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = selectedStatus === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setValue('status', opt.value)}
                      className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${isSelected
                          ? 'border-[#7857FF] bg-[#7857FF]/[0.04] dark:bg-[#7857FF]/10 shadow-sm'
                          : 'border-[#111111]/10 dark:border-white/10 bg-transparent hover:border-[#111111]/25 dark:hover:border-white/25'
                        } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.08em] ${opt.colorClass}`}
                      >
                        {opt.label}
                      </span>
                      <span className="mt-2 text-[12.5px] text-[#737373] dark:text-[#A1A1AA]">
                        {opt.desc}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="pt-2 border-t border-[#111111]/[0.08] dark:border-white/10">
              <label className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors mb-3">
                Trail Visibility
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setValue('isPublic', true)}
                  className={`flex-1 flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${isPublic
                      ? 'border-[#7857FF] bg-[#7857FF]/[0.04] dark:bg-[#7857FF]/10'
                      : 'border-[#111111]/10 dark:border-white/10 bg-transparent hover:border-[#111111]/25'
                    } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Globe className={`h-4 w-4 ${isPublic ? 'text-[#7857FF]' : 'text-[#737373]'}`} />
                  <div>
                    <p className="text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                      Public Trail
                    </p>
                    <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                      Visible in community feed
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setValue('isPublic', false)}
                  className={`flex-1 flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${!isPublic
                      ? 'border-[#7857FF] bg-[#7857FF]/[0.04] dark:bg-[#7857FF]/10'
                      : 'border-[#111111]/10 dark:border-white/10 bg-transparent hover:border-[#111111]/25'
                    } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Lock className={`h-4 w-4 ${!isPublic ? 'text-[#7857FF]' : 'text-[#737373]'}`} />
                  <div>
                    <p className="text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                      Private Trail
                    </p>
                    <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                      Only visible to you
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#111111]/[0.08] dark:border-white/10">
              <TransitionLink
                href="/dashboard"
                className={`px-5 py-2.5 rounded-full text-[13.5px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
              >
                Cancel
              </TransitionLink>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-7 py-2.5 text-[14px] font-semibold text-[#F6F5EF] dark:text-[#111111] shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] dark:shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)] hover:bg-[#111111]/88 dark:hover:bg-[#FFFFFF]/88 transition-all disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin text-[#C7FF3D] dark:text-[#7857FF]" />}
                <span>{isSubmitting ? 'Creating trail...' : 'Create Trail'}</span>
              </button>
            </div>
          </form>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}
