import { TransitionLink } from '@/components/animations/route-transition'
import { FollowButton } from '@/components/sparktrail/follow-button'

interface UserListItem {
  id: string
  name: string
  username: string
  avatarUrl?: string | null
  bio?: string | null
  isFollowing: boolean
}

export function UserList({ users, currentUserId }: { users: UserListItem[], currentUserId?: string }) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#111111]/15 dark:border-white/15 bg-white/40 dark:bg-[#16171A]/40 p-12 text-center">
        <p className="text-[14.5px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
          No users found.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {users.map((user) => {
        const initials = user.name
          ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
          : user.username.slice(0, 2).toUpperCase()

        return (
          <div key={user.id} className="flex items-center justify-between rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-5 shadow-sm">
            <TransitionLink href={`/profile/${user.username}`} className="flex items-center gap-3 group min-w-0">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] text-[13px] font-bold text-white uppercase group-hover:shadow-md transition-shadow">
                {initials}
              </span>
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
          </div>
        )
      })}
    </div>
  )
}
