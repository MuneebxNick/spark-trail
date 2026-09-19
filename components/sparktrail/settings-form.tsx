'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@/lib/validations/settings'
import { updateProfile, changePassword, deleteAccount } from '@/actions/settings'
import { useRouteTransition } from '@/components/animations/route-transition'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { UserAvatar } from '@/components/sparktrail/user-avatar'
import {
  Camera,
  Check,
  Loader2,
  Lock,
  Shield,
  AlertTriangle,
  X,
} from 'lucide-react'

interface SettingsFormProps {
  user: {
    id: string
    email: string
    username: string
    name: string
    avatarUrl?: string | null
    bio?: string | null
  }
}

function ProfileSection({ user }: SettingsFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarData, setAvatarData] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio || '',
      avatarData: null,
    },
  })

  const bioValue = watch('bio') || ''

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setServerError('Image must be under 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      setAvatarData(result)
      setServerError(null)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsSubmitting(true)
    setServerError(null)
    setServerSuccess(false)

    const payload: UpdateProfileInput = {
      ...data,
      avatarData: avatarData || null,
    }

    const result = await updateProfile(payload)

    if (result.success) {
      setServerSuccess(true)
      setAvatarData(null)
      setTimeout(() => setServerSuccess(false), 3000)
    } else {
      setServerError(result.error || 'Failed to update profile.')
    }

    setIsSubmitting(false)
  }

  const displayAvatarUrl = avatarPreview || user.avatarUrl

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7857FF]"
        >
          {displayAvatarUrl ? (
            <img
              src={displayAvatarUrl}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <UserAvatar
              avatarUrl={null}
              name={user.name}
              username={user.username}
              size="xl"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6" />
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={handleAvatarChange}
          className="hidden"
        />
        <div className="space-y-1">
          <p className="text-[14px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
            Profile Photo
          </p>
          <p className="text-[12.5px] text-[#737373] dark:text-[#A1A1AA]">
            Click to upload. PNG, JPG, WEBP or GIF. Max 5MB.
          </p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]"
        >
          Display Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full rounded-xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-4 py-3 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#737373]/50 focus:outline-none focus:ring-2 focus:ring-[#7857FF]/40 transition-shadow"
          placeholder="Your display name"
        />
        {errors.name && (
          <p className="text-[12px] text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]"
        >
          Username
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14.5px] text-[#737373] dark:text-[#A1A1AA]">
            @
          </span>
          <input
            id="username"
            type="text"
            {...register('username')}
            className="w-full rounded-xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] pl-9 pr-4 py-3 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#737373]/50 focus:outline-none focus:ring-2 focus:ring-[#7857FF]/40 transition-shadow"
            placeholder="username"
          />
        </div>
        {errors.username && (
          <p className="text-[12px] text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="bio"
            className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]"
          >
            Bio
          </label>
          <span
            className={`text-[11px] font-medium ${
              bioValue.length > 260
                ? 'text-red-500'
                : 'text-[#737373] dark:text-[#A1A1AA]'
            }`}
          >
            {bioValue.length}/280
          </span>
        </div>
        <textarea
          id="bio"
          rows={3}
          {...register('bio')}
          className="w-full resize-none rounded-xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-4 py-3 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#737373]/50 focus:outline-none focus:ring-2 focus:ring-[#7857FF]/40 transition-shadow"
          placeholder="Tell others about your journey..."
        />
        {errors.bio && (
          <p className="text-[12px] text-red-500">{errors.bio.message}</p>
        )}
      </div>

      {/* Email (read-only) */}
      <div className="space-y-2">
        <label className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-xl border border-[#111111]/[0.06] dark:border-white/5 bg-[#F6F5EF] dark:bg-[#0D0E10] px-4 py-3 text-[14.5px] text-[#737373] dark:text-[#A1A1AA] cursor-not-allowed"
        />
        <p className="text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
          Email changes are not supported yet.
        </p>
      </div>

      {/* Feedback + Submit */}
      {serverError && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      {serverSuccess && (
        <div className="rounded-xl border border-[#C7FF3D]/30 bg-[#C7FF3D]/10 px-4 py-3 text-[13px] text-[#111111] dark:text-[#C7FF3D] flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Profile updated successfully.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-6 py-3 text-[13.5px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/85 dark:hover:bg-[#FFFFFF]/90 transition-all shadow-[0_4px_14px_-4px_rgba(17,17,17,0.35)] dark:shadow-[0_4px_14px_-4px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>Save Changes</span>
        )}
      </button>
    </form>
  )
}

function SecuritySection() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsSubmitting(true)
    setServerError(null)
    setServerSuccess(false)

    const result = await changePassword(data)

    if (result.success) {
      setServerSuccess(true)
      reset()
      setTimeout(() => setServerSuccess(false), 3000)
    } else {
      setServerError(result.error || 'Failed to change password.')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="currentPassword"
          className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]"
        >
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          className="w-full rounded-xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-4 py-3 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#737373]/50 focus:outline-none focus:ring-2 focus:ring-[#7857FF]/40 transition-shadow"
          placeholder="Enter current password"
        />
        {errors.currentPassword && (
          <p className="text-[12px] text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]"
        >
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          className="w-full rounded-xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-4 py-3 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#737373]/50 focus:outline-none focus:ring-2 focus:ring-[#7857FF]/40 transition-shadow"
          placeholder="At least 8 characters"
        />
        {errors.newPassword && (
          <p className="text-[12px] text-red-500">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF]"
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="w-full rounded-xl border border-[#111111]/[0.12] dark:border-white/10 bg-white dark:bg-[#16171A] px-4 py-3 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] placeholder-[#737373]/50 focus:outline-none focus:ring-2 focus:ring-[#7857FF]/40 transition-shadow"
          placeholder="Re-enter new password"
        />
        {errors.confirmPassword && (
          <p className="text-[12px] text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      {serverSuccess && (
        <div className="rounded-xl border border-[#C7FF3D]/30 bg-[#C7FF3D]/10 px-4 py-3 text-[13px] text-[#111111] dark:text-[#C7FF3D] flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Password updated successfully.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full border border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] px-6 py-3 text-[13.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] hover:border-[#7857FF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 text-[#7857FF]" />
            <span>Update Password</span>
          </>
        )}
      </button>
    </form>
  )
}

function DangerZone() {
  const { transitionTo } = useRouteTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setServerError(null)

    const result = await deleteAccount()

    if (result.success) {
      transitionTo('/')
    } else {
      setServerError(result.error || 'Failed to delete account.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13.5px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
        Permanently delete your account and all associated data including
        trails, entries, sparks, comments, and followers. This action cannot
        be undone.
      </p>

      {serverError && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-5 py-2.5 text-[13px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Delete Account</span>
        </button>
      ) : (
        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-6 space-y-4">
          <p className="text-[14px] font-semibold text-red-600 dark:text-red-400">
            Are you absolutely sure?
          </p>
          <p className="text-[13px] text-[#737373] dark:text-[#A1A1AA]">
            All your trails, progress entries, sparks, comments, and
            follower relationships will be permanently removed.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 dark:bg-red-500 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Yes, delete my account</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-full border border-[#111111]/10 dark:border-white/10 px-5 py-2.5 text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function SettingsForm({ user }: SettingsFormProps) {
  return (
    <StaggerContainer className="mx-auto max-w-2xl space-y-12">
      {/* Page Header */}
      <StaggerItem className="space-y-3 border-b border-[#111111]/[0.08] dark:border-white/10 pb-8">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7857FF]" />
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#7857FF] uppercase">
            Account
          </p>
        </div>
        <h1 className="font-heading text-[32px] font-semibold leading-tight tracking-tight text-[#111111] dark:text-[#FFFFFF] sm:text-[42px]">
          Settings
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-[#737373] dark:text-[#D4D4D8]">
          Manage your identity, profile details, and account security.
        </p>
      </StaggerItem>

      {/* Profile Section */}
      <StaggerItem className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C7FF3D]" />
          <h2 className="font-heading text-[13px] font-semibold tracking-[0.14em] text-[#111111] dark:text-[#FFFFFF] uppercase">
            Profile
          </h2>
        </div>
        <div className="rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-6 sm:p-8 shadow-sm">
          <ProfileSection user={user} />
        </div>
      </StaggerItem>

      <hr className="border-[#111111]/[0.08] dark:border-white/10" />

      {/* Security Section */}
      <StaggerItem className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#7857FF]" />
          <h2 className="font-heading text-[13px] font-semibold tracking-[0.14em] text-[#111111] dark:text-[#FFFFFF] uppercase">
            Security
          </h2>
        </div>
        <div className="rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-6 sm:p-8 shadow-sm">
          <SecuritySection />
        </div>
      </StaggerItem>

      <hr className="border-[#111111]/[0.08] dark:border-white/10" />

      {/* Danger Zone */}
      <StaggerItem className="space-y-6 pb-12">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h2 className="font-heading text-[13px] font-semibold tracking-[0.14em] text-red-600 dark:text-red-400 uppercase">
            Danger Zone
          </h2>
        </div>
        <div className="rounded-2xl border border-red-200/50 dark:border-red-500/10 bg-white dark:bg-[#16171A] p-6 sm:p-8 shadow-sm">
          <DangerZone />
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}
