'use client'

import { useState } from 'react'
import { MoreHorizontal, Trash2, Edit2, Loader2, Image as ImageIcon } from 'lucide-react'
import { deleteTrailEntry, updateTrailEntry } from '@/actions/trails'
import { useToast } from '@/components/sparktrail/toast'
import type { ProgressStatus } from '@prisma/client'

const STATUS_STYLES: Record<ProgressStatus, string> = {
  LEARNING: 'bg-[#7857FF]/10 text-[#7857FF]',
  BUILDING: 'bg-[#C7FF3D]/20 text-[#5D7A1D] dark:text-[#C7FF3D]',
  STUCK: 'bg-[#111111]/10 dark:bg-white/10 text-[#111111] dark:text-[#FFFFFF]',
  WIN: 'bg-[#C7FF3D]/20 text-[#5D7A1D] dark:text-[#C7FF3D]',
}

const STATUS_NODE_COLORS: Record<ProgressStatus, string> = {
  LEARNING: '#7857FF',
  BUILDING: '#C7FF3D',
  STUCK: '#737373',
  WIN: '#C7FF3D',
}

function StatusBadge({ status }: { status: ProgressStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

interface TrailEntryProps {
  entry: {
    id: string
    content: string
    statusTag: ProgressStatus
    mediaUrl: string | null
    createdAt: Date
  }
  isOwner: boolean
}

export function TrailEntryItem({ entry, isOwner }: TrailEntryProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Edit state
  const [editContent, setEditContent] = useState(entry.content)
  const [editStatus, setEditStatus] = useState<ProgressStatus>(entry.statusTag)
  const [editMediaUrl, setEditMediaUrl] = useState<string | null>(entry.mediaUrl)

  const handleUpdate = async () => {
    if (!editContent.trim()) return

    setIsSaving(true)
    const result = await updateTrailEntry({
      entryId: entry.id,
      content: editContent,
      statusTag: editStatus,
      mediaUrl: editMediaUrl,
      imageData: null,
    })

    if (result.success) {
      toast('Entry updated successfully.', 'success')
      setIsEditing(false)
    } else {
      toast(result.error || 'Failed to update entry.', 'error')
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteTrailEntry(entry.id)
    if (result.success) {
      toast('Entry deleted.', 'success')
      // revalidatePath will handle the UI removal
    } else {
      toast(result.error || 'Failed to delete entry.', 'error')
      setIsDeleting(false)
      setDeleteConfirm(false)
    }
  }

  const nodeColor = STATUS_NODE_COLORS[entry.statusTag]

  const TimelineMarker = () => (
    <div
      className="absolute -left-[45px] sm:-left-[53px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white dark:border-[#0D0E10] shadow-sm z-10 transition-colors pointer-events-none"
      style={{ backgroundColor: nodeColor }}
      aria-hidden="true"
    />
  )

  return (
    <div className="relative w-full">
      <div className="w-full rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] shadow-[0_4px_20px_-10px_rgba(17,17,17,0.06)] dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.4)] transition-all group">
        
        {/* View Mode */}
        {!isEditing && (
          <div className="p-6 space-y-3">
            <div className="flex min-h-8 items-center justify-between relative">
              <TimelineMarker />
              <StatusBadge status={entry.statusTag} />
              
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-[#737373] dark:text-[#A1A1AA]">
                  {formatDate(entry.createdAt)}
                </span>
                
                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      aria-label="Entry options"
                      aria-expanded={showMenu}
                      className={`p-1 rounded-full text-[#737373] hover:bg-[#111111]/5 dark:hover:bg-white/10 transition-colors focus:opacity-100 ${showMenu ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {showMenu && (
                      <>
                        <div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => { setShowMenu(false); setDeleteConfirm(false); }} />
                        <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-1 shadow-lg z-50 overflow-hidden">
                          {!deleteConfirm ? (
                            <>
                              <button
                                onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(true)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </>
                          ) : (
                            <div className="p-2 flex flex-col gap-2">
                              <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 text-center uppercase tracking-wider">Confirm</span>
                              <div className="flex gap-1">
                                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 rounded bg-red-600 py-1.5 text-[11px] font-semibold text-white hover:bg-red-700 transition-colors flex items-center justify-center">
                                  {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Yes'}
                                </button>
                                <button onClick={() => setDeleteConfirm(false)} disabled={isDeleting} className="flex-1 rounded border border-[#111111]/10 dark:border-white/10 py-1.5 text-[11px] font-semibold hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors">
                                  No
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[15px] leading-relaxed text-[#111111] dark:text-[#F6F5EF] whitespace-pre-wrap">
              {entry.content}
            </p>

            {entry.mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-[#111111]/10 dark:border-white/10 bg-[#111111]/[0.02] dark:bg-white/[0.02]">
                <a
                  href={entry.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden"
                  title="Click to view full image"
                >
                  <img
                    src={entry.mediaUrl}
                    alt="Trail progress attachment"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="p-6 bg-[#111111]/[0.02] dark:bg-white/[0.02] space-y-4 rounded-2xl">
            <div className="flex min-h-8 items-center justify-between relative">
              <TimelineMarker />
              <span className="text-[12px] font-semibold tracking-wider text-[#7857FF] uppercase">
                Edit Entry
              </span>
              <div className="flex gap-2">
                {(['BUILDING', 'LEARNING', 'STUCK', 'WIN'] as ProgressStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setEditStatus(status)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      editStatus === status 
                        ? STATUS_STYLES[status] + ' ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#16171A] ' + (status === 'LEARNING' ? 'ring-[#7857FF]' : status === 'STUCK' ? 'ring-[#111111] dark:ring-white' : 'ring-[#C7FF3D]')
                        : 'border border-[#111111]/10 dark:border-white/10 text-[#737373] dark:text-[#A1A1AA] hover:bg-[#111111]/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[120px] resize-y rounded-xl border border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] p-4 text-[14.5px] text-[#111111] dark:text-[#FFFFFF] focus:border-[#7857FF]/50 focus:outline-none focus:ring-1 focus:ring-[#7857FF]/50 transition-all"
              placeholder="What did you learn or build?"
            />
            
            <div className="flex items-center gap-3">
              <ImageIcon className="h-4 w-4 text-[#737373]" />
              <input 
                type="text" 
                value={editMediaUrl || ''}
                onChange={(e) => setEditMediaUrl(e.target.value)}
                placeholder="Image URL (optional)" 
                className="flex-1 rounded-lg border border-[#111111]/10 dark:border-white/10 bg-white dark:bg-[#16171A] px-3 py-2 text-[12px] focus:border-[#7857FF]/50 focus:outline-none focus:ring-1 focus:ring-[#7857FF]/50" 
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setIsEditing(false); setEditContent(entry.content); setEditStatus(entry.statusTag); setEditMediaUrl(entry.mediaUrl); }}
                className="rounded-full border border-[#111111]/10 dark:border-white/10 px-5 py-2 text-[12.5px] font-semibold text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSaving || !editContent.trim()}
                className="flex items-center justify-center min-w-[80px] rounded-full bg-[#111111] dark:bg-[#FFFFFF] px-5 py-2 text-[12.5px] font-semibold text-[#F6F5EF] dark:text-[#111111] hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
