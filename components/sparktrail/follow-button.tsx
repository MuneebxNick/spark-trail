'use client'

import { useState } from 'react'
import { toggleFollow } from '@/actions/profile'
import { UserPlus, UserMinus } from 'lucide-react'

interface FollowButtonProps {
  targetUserId: string
  initialFollowing: boolean
}

export function FollowButton({ targetUserId, initialFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async () => {
    if (isPending) return

    setIsFollowing(!isFollowing)
    setIsPending(true)

    const res = await toggleFollow(targetUserId)

    if (!res.success) {
      setIsFollowing(isFollowing)
    }

    setIsPending(false)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isFollowing ? 'Unfollow this user' : 'Follow this user'}
      aria-pressed={isFollowing}
      className={`group flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all shadow-sm ${
        isFollowing
          ? 'bg-[#111111]/5 dark:bg-white/10 text-[#111111] dark:text-[#FFFFFF] hover:bg-[#111111]/10 dark:hover:bg-white/15'
          : 'bg-[#111111] dark:bg-[#FFFFFF] text-[#F6F5EF] dark:text-[#111111] hover:bg-[#111111]/85 dark:hover:bg-[#FFFFFF]/90'
      }`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 text-[#C7FF3D] dark:text-[#7857FF]" />
          <span>Follow</span>
        </>
      )}
    </button>
  )
}
