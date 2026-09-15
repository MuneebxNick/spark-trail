'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { loginUser } from '@/actions/auth'
import {
  TransitionLink,
  useRouteTransition,
} from '@/components/animations/route-transition'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const { transitionTo } = useRouteTransition()

  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    setIsSubmitting(true)

    try {
      const res = await loginUser(data)
      if (res.success) {
        transitionTo(callbackUrl)
      } else {
        setServerError(res.error || 'Failed to log in.')
        setIsSubmitting(false)
      }
    } catch {
      setServerError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <StaggerContainer className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:items-center">
      {/* Left Column: Editorial Brand Panel */}
      <div className="flex flex-col items-start space-y-6">
        <StaggerItem y={10}>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7857FF]" />
            <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
              Welcome back
            </p>
          </div>
        </StaggerItem>

        <StaggerItem y={14}>
          <h1 className="font-heading text-[36px] font-semibold leading-[1.08] tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[44px] md:text-[50px]">
            Continue your trail.
          </h1>
        </StaggerItem>

        <StaggerItem y={12}>
          <p className="max-w-md text-[16px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
            Every attempt, every blocker, and every win logged along the way &mdash;
            the part that actually explains the result.
          </p>
        </StaggerItem>

        <StaggerItem y={12}>
          <div className="w-full max-w-md rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white/50 dark:bg-[#16171A]/50 p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[#7857FF]">
              <Sparkles className="h-4 w-4" />
              <span className="font-heading text-[12px] font-semibold tracking-[0.1em] uppercase">
                Progress Has a Story
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
              Pick up right where you left off. Document your journey without the noise
              of traditional social feeds.
            </p>
          </div>
        </StaggerItem>
      </div>

      {/* Right Column: Refined & Compact Login Form Box */}
      <StaggerItem y={16} className="w-full max-w-[420px] mx-auto lg:mx-0">
        <div className="rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-7 md:p-8 shadow-[0_10px_35px_-15px_rgba(17,17,17,0.08)] dark:shadow-[0_10px_35px_-15px_rgba(0,0,0,0.5)] transition-colors">
          <div className="space-y-1">
            <h2 className="font-heading text-[20px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
              Log in to SparkTrail
            </h2>
            <p className="text-[13px] text-[#737373] dark:text-[#D4D4D8]">
              Enter your credentials to access your studio.
            </p>
          </div>

          {serverError && (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-[13px] text-red-600 dark:text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors">
                Email address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#111111]/15 dark:border-white/15 bg-transparent px-4 text-[14px] text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#8A8A8A] dark:placeholder:text-[#71717A] focus:border-[#7857FF] focus:ring-1 focus:ring-[#7857FF]/20 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-[12px] text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] transition-colors">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-[#111111]/15 dark:border-white/15 bg-transparent pl-4 pr-11 text-[14px] text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#8A8A8A] dark:placeholder:text-[#71717A] focus:border-[#7857FF] focus:ring-1 focus:ring-[#7857FF]/20 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[12px] text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-7 py-2.5 text-[14px] font-semibold text-[#F6F5EF] dark:text-[#111111] shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] dark:shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)] hover:bg-[#111111]/88 dark:hover:bg-[#FFFFFF]/88 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#111111]/[0.08] dark:border-white/10 text-[13px] text-[#737373] dark:text-[#A1A1AA]">
            Don&apos;t have an account?{' '}
            <TransitionLink
              href="/register"
              className="inline-flex items-center gap-1 font-semibold text-[#7857FF] hover:underline"
            >
              <span>Start your trail</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </TransitionLink>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-[#737373]">
          Loading studio login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
