'use client'

import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  addTrailEntrySchema,
  type AddTrailEntryInput,
  type progressStatusEnum,
} from '@/lib/validations/trail'
import { addTrailEntry } from '@/actions/trails'
import {
  Plus,
  Sparkles,
  Send,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { z } from 'zod'

type StatusType = z.infer<typeof progressStatusEnum>

const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const

const STATUS_OPTIONS: { value: StatusType; label: string; colorClass: string }[] = [
  { value: 'BUILDING', label: 'BUILDING', colorClass: 'bg-[#C7FF3D] text-[#111111]' },
  { value: 'LEARNING', label: 'LEARNING', colorClass: 'bg-[#7857FF] text-white' },
  { value: 'STUCK', label: 'STUCK', colorClass: 'bg-[#111111] text-[#F6F5EF]' },
  { value: 'WIN', label: 'WIN', colorClass: 'bg-[#C7FF3D] text-[#111111]' },
]

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export function TrailEntryForm({
  trailId,
  currentStatus,
}: {
  trailId: string
  currentStatus: StatusType
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Media attachment state
  const [mediaMode, setMediaMode] = useState<'none' | 'upload' | 'url'>('none')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string
    size: string
  } | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [isReadingFile, setIsReadingFile] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddTrailEntryInput>({
    resolver: zodResolver(addTrailEntrySchema),
    defaultValues: {
      trailId,
      statusTag: currentStatus,
      content: '',
      mediaUrl: '',
      imageData: '',
    },
  })

  const selectedStatusTag = watch('statusTag')
  const enteredMediaUrl = watch('mediaUrl')

  // Auto-focus textarea when form smoothly opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle device file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMediaError(null)
    const file = e.target.files?.[0]
    if (!file) return

    const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
    if (!validMimes.includes(file.type.toLowerCase())) {
      setMediaError('Please select a valid image file (PNG, JPG, WEBP, GIF).')
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setMediaError(`Image exceeds ${MAX_FILE_SIZE_MB}MB limit.`)
      return
    }

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    setSelectedFileMeta({ name: file.name, size: sizeFormatted })
    setIsReadingFile(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUri = event.target?.result as string
      setPreviewUrl(dataUri)
      setValue('imageData', dataUri)
      setIsReadingFile(false)
    }
    reader.onerror = () => {
      setMediaError('Failed to read selected image file. Please try again.')
      setIsReadingFile(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveMedia = () => {
    setPreviewUrl(null)
    setSelectedFileMeta(null)
    setMediaError(null)
    setIsReadingFile(false)
    setValue('mediaUrl', '')
    setValue('imageData', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    if (isSubmitting || isReadingFile) return
    handleRemoveMedia()
    setMediaMode('none')
    setServerError(null)
    setIsOpen(false)
  }

  const onSubmit = async (data: AddTrailEntryInput) => {
    if (isSubmitting || isReadingFile) return
    setServerError(null)
    setIsSubmitting(true)

    try {
      const res = await addTrailEntry(data)
      if (res.success) {
        setIsSuccess(true)
        setTimeout(() => {
          reset({
            trailId,
            statusTag: data.statusTag,
            content: '',
            mediaUrl: '',
            imageData: '',
          })
          handleRemoveMedia()
          setMediaMode('none')
          setIsSuccess(false)
          setIsOpen(false)
          setIsSubmitting(false)
        }, 500)
      } else {
        setServerError(res.error || 'Failed to post progress entry.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Trail entry submission error:', err)
      setServerError('An unexpected error occurred while saving your entry. Please try again.')
      setIsSubmitting(false)
    }
  }

  const { ref: formContentRef, ...contentRest } = register('content')

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {!isOpen ? (
          /* Subtle, polished trigger button */
          <motion.div
            key="trigger-button"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: EASE_CINEMATIC }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-5 py-2.5 text-[13.5px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/88 dark:hover:bg-[#FFFFFF]/88 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#C7FF3D] dark:text-[#7857FF]" />
              <span>Log Progress Entry</span>
            </button>
          </motion.div>
        ) : (
          /* Smoothly expanding editorial form container */
          <motion.div
            key="entry-form-container"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.36, ease: EASE_CINEMATIC }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#7857FF]/30 bg-white dark:bg-[#16171A] p-6 shadow-[0_10px_35px_-15px_rgba(120,87,255,0.15)] transition-all">
              {/* Form Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#111111]/[0.08] dark:border-white/10">
                <div className="flex items-center gap-2 text-[#7857FF]">
                  <Sparkles className="h-4 w-4" />
                  <h3 className="font-heading text-[13px] font-semibold tracking-[0.12em] uppercase">
                    Log New Milestone / Entry
                  </h3>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleClose}
                  className="text-[12px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {serverError && (
                <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-[13px] text-red-600 dark:text-red-400">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                {/* Status Moment Selector */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#737373] dark:text-[#A1A1AA] uppercase tracking-wider mb-2">
                    Status Moment
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((opt) => {
                      const isSelected = selectedStatusTag === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setValue('statusTag', opt.value)}
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.08em] transition-all ${isSelected
                              ? `${opt.colorClass} ring-2 ring-[#7857FF] ring-offset-2 dark:ring-offset-[#16171A]`
                              : 'bg-[#111111]/5 dark:bg-white/10 text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111]'
                            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Content Textarea */}
                <div>
                  <textarea
                    rows={3}
                    disabled={isSubmitting}
                    ref={(el) => {
                      formContentRef(el)
                      textareaRef.current = el
                    }}
                    {...contentRest}
                    placeholder="What did you learn, build, fix, or win? Document the exact step..."
                    className="w-full rounded-xl border border-[#111111]/15 dark:border-white/15 bg-transparent p-4 text-[14px] text-[#111111] dark:text-[#FFFFFF] placeholder:text-[#8A8A8A] dark:placeholder:text-[#71717A] focus:border-[#7857FF] focus:ring-1 focus:ring-[#7857FF]/20 focus:outline-none transition-colors resize-none disabled:opacity-60"
                  />
                  {errors.content && (
                    <p className="mt-1 text-[12px] text-red-500">{errors.content.message}</p>
                  )}
                </div>

                {/* Media Attachment Section */}
                <div className="pt-2 border-t border-[#111111]/[0.08] dark:border-white/10 space-y-3">
                  {mediaMode === 'none' && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setMediaMode('upload')}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#7857FF] hover:underline cursor-pointer disabled:opacity-50"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        <span>Attach screenshot from device</span>
                      </button>
                      <span className="text-[#8A8A8A] text-[12px]">&middot;</span>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setMediaMode('url')}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] cursor-pointer disabled:opacity-50"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        <span>Image URL</span>
                      </button>
                    </div>
                  )}

                  {/* Mode 1: Device File Upload */}
                  {mediaMode === 'upload' && (
                    <div className="rounded-xl border border-[#111111]/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#141517] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-[#7857FF]" />
                          <span className="text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                            Attach Image from Device
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveMedia()
                            setMediaMode('none')
                          }}
                          className="text-[11.5px] text-[#737373] hover:text-[#111111] dark:hover:text-white cursor-pointer"
                        >
                          Close
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        className="hidden"
                        id="trail-media-file-input"
                      />

                      {!previewUrl ? (
                        <label
                          htmlFor="trail-media-file-input"
                          className="flex flex-col items-center justify-center p-5 border border-dashed border-[#111111]/20 dark:border-white/20 rounded-xl cursor-pointer hover:border-[#7857FF] transition-colors"
                        >
                          <ImageIcon className="h-6 w-6 text-[#737373] mb-1.5" />
                          <span className="text-[13px] font-medium text-[#111111] dark:text-[#FFFFFF]">
                            Choose an image or screenshot
                          </span>
                          <span className="text-[11px] text-[#737373] dark:text-[#A1A1AA] mt-0.5">
                            PNG, JPG, WEBP up to 5MB
                          </span>
                        </label>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border border-[#111111]/10 dark:border-white/10 bg-black/5">
                          {/* eslint-disable-next-html-element-suppression */}
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-52 w-full object-contain bg-[#111111]/5 dark:bg-black/40"
                          />
                          <div className="flex items-center justify-between p-2.5 bg-white/90 dark:bg-[#16171A]/90 border-t border-[#111111]/10 dark:border-white/10 text-[12px]">
                            <div className="truncate max-w-[240px] text-[#111111] dark:text-[#FFFFFF] font-medium">
                              {selectedFileMeta?.name} ({selectedFileMeta?.size})
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveMedia}
                              className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-medium cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {mediaError && (
                        <p className="text-[12px] text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{mediaError}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mode 2: Direct Image URL */}
                  {mediaMode === 'url' && (
                    <div className="rounded-xl border border-[#111111]/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#141517] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-[#7857FF]" />
                          <span className="text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF]">
                            Attach Public Image URL
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveMedia()
                            setMediaMode('none')
                          }}
                          className="text-[11.5px] text-[#737373] hover:text-[#111111] dark:hover:text-white cursor-pointer"
                        >
                          Close
                        </button>
                      </div>

                      <input
                        type="url"
                        disabled={isSubmitting}
                        {...register('mediaUrl')}
                        placeholder="https://example.com/screenshot.png"
                        className="h-10 w-full rounded-xl border border-[#111111]/15 dark:border-white/15 bg-transparent px-3.5 text-[13px] text-[#111111] dark:text-[#FFFFFF] focus:border-[#7857FF] focus:outline-none"
                      />

                      {enteredMediaUrl && (
                        <div className="overflow-hidden rounded-lg border border-[#111111]/10 dark:border-white/10">
                          {/* eslint-disable-next-html-element-suppression */}
                          <img
                            src={enteredMediaUrl}
                            alt="Preview URL"
                            className="max-h-40 w-full object-contain bg-[#111111]/5"
                            onError={() => {
                              // Silently ignore or handle invalid URLs
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#111111]/[0.08] dark:border-white/10">
                  <button
                    type="submit"
                    disabled={isSubmitting || isReadingFile}
                    className="inline-flex items-center gap-2 rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-6 py-2.5 text-[13.5px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/88 dark:hover:bg-[#FFFFFF]/88 transition-all disabled:opacity-75 cursor-pointer shadow-sm"
                  >
                    {isReadingFile ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C7FF3D] dark:text-[#7857FF]" />
                        <span>Loading image...</span>
                      </>
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C7FF3D] dark:text-[#7857FF]" />
                        <span>Saving milestone...</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                        <span>Milestone saved!</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Publish Update</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
