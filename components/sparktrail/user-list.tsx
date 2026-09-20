'use client'

import { useState, useEffect } from 'react'
import { TransitionLink } from '@/components/animations/route-transition'
import { FollowButton } from '@/components/sparktrail/follow-button'
import { UserAvatar } from '@/components/sparktrail/user-avatar'
import { Loader2, ChevronDown } from 'lucide-react'
import { getFollowers, getFollowing } from '@/actions/profile'
import { StaggerItem } from '@/components/animations/page-transition'

interface UserListItem {
  id: string
  name: string
  username: string
  avatarUrl?: string | null
  bio?: string | null
  isFollowing: boolean
}

interface UserListProps {
  initialUsers: UserListItem[]
  initialNextCursor?: string
  currentUserId?: string
  profileUsername: string
  listType: 'followers' | 'following'
}

export function UserList({ initialUsers, initialNextCursor, currentUserId, profileUsername, listType }: UserListProps) {
  const [users, setUsers] = useState<UserListItem[]>(initialUsers)
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor)
  const [isLoading, setIsLoading] = useState(false)

  // Sync state with server revalidations (e.g. after follow toggle)
  useEffect(() => {
    setUsers((prev) => {
      const merged = [...initialUsers]
      for (const p of prev) {
        if (!merged.some((m) => m.id === p.id)) {
          merged.push(p)
        } else {
          // If it exists in initialUsers, we use the server's version (updated follow status)
          // The spread [...initialUsers] already has the updated ones.
        }
      }
      return merged
    })
  }, [initialUsers])

  const handleLoadMore = async () => {
    if (isLoading || !nextCursor) return

    setIsLoading(true)
    const action = listType === 'followers' ? getFollowers : getFollowing
    const result = await action(profileUsername, nextCursor, 20)
    
    if (result.success && result.users) {
      setUsers((prev) => {
        const merged = [...prev]
        for (const newUser of (result.users as UserListItem[]) || []) {
          if (!merged.some((m) => m.id === newUser.id)) {
            merged.push(newUser)
          }
        }
        return merged
      })
      setNextCursor(result.nextCursor)
    } else {
      console.error(result.error)
    }
    
    setIsLoading(false)
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#111111]/15 dark:border-white/15 bg-white/40 dark:bg-[#16171A]/40 p-12 text-center">
        <p className="text-[14.5px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
          {listType === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {users.map((user) => {
          return (
            <StaggerItem key={user.id} className="flex items-center justify-between rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-5 shadow-sm">
              <TransitionLink href={`/profile/${user.username}`} className="flex items-center gap-3 group min-w-0">
                <UserAvatar avatarUrl={user.avatarUrl} name={user.name} username={user.username} size="lg" className="group-hover:shadow-md transition-shadow" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-[#111111] dark:text-[#FFFFFF] group-hover:text-[#7857FF] transition-colors truncate">
                    {user.name}
                  </span>
                  <span className="text-[12px] text-[#737373] dark:text-[#A1A1AA] truncate">
                    @{user.username}
                  </span>
                  {user.bio && (
                    <span className="text-[12px] text-[#737373] dark:text-[#A1A1AA] line-clamp-1 mt-1">
                      {user.bio}
                    </span>
                  )}
                </div>
              </TransitionLink>

              {currentUserId !== user.id && currentUserId && (
                <div className="shrink-0 ml-4">
                  <FollowButton targetUserId={user.id} initialFollowing={user.isFollowing} />
                </div>
              )}
            </StaggerItem>
          )
        })}
      </div>

      {nextCursor && (
        <StaggerItem className="pt-4 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full border border-[#111111]/10 dark:border-white/10 bg-white/80 dark:bg-[#16171A]/80 px-6 py-3 text-[13px] font-semibold text-[#111111] dark:text-[#FFFFFF] shadow-sm hover:bg-[#111111]/5 dark:hover:bg-white/5 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#7857FF]" /> : <ChevronDown className="h-4 w-4 text-[#737373]" />}
            <span>{isLoading ? 'Loading...' : 'Load more users'}</span>
          </button>
        </StaggerItem>
      )}
    </div>
  )
}
