'use client'

import { useState } from 'react'
import { deleteTrail } from '@/actions/trails'
import { useRouteTransition } from '@/components/animations/route-transition'
import { useToast } from '@/components/sparktrail/toast'
import { Trash2 } from 'lucide-react'

export function DeleteTrailButton({ trailId }: { trailId: string }) {
  const { transitionTo } = useRouteTransition()
  const { toast } = useToast()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteTrail(trailId)
      if (res.success) {
        toast('Trail deleted successfully.', 'success')
        transitionTo('/trails')
      } else {
        toast(res.error || 'Failed to delete trail.', 'error')
        setIsDeleting(false)
        setIsConfirming(false)
      }
    } catch {
      toast('An unexpected error occurred.', 'error')
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-medium text-red-600 dark:text-red-400">
          Delete trail permanently?
        </span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-full bg-red-600 px-3 py-1 text-[12px] font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="rounded-full border border-[#111111]/10 dark:border-white/10 px-3 py-1 text-[12px] font-medium text-[#737373] dark:text-[#A1A1AA]"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#111111]/10 dark:border-white/10 bg-transparent px-3.5 py-1.5 text-[12.5px] font-medium text-red-600 dark:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-colors"
      title="Delete trail"
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span>Delete Trail</span>
    </button>
  )
}
