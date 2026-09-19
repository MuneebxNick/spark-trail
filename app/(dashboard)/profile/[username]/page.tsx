import { getUserProfile } from '@/actions/profile'
import { getCurrentUser } from '@/lib/auth/session'
import { notFound } from 'next/navigation'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/page-transition'
import { TransitionLink } from '@/components/animations/route-transition'
import { FollowButton } from '@/components/sparktrail/follow-button'
import { UserAvatar } from '@/components/sparktrail/user-avatar'
import { ArrowRight, Layers, Compass, Zap, MessageSquare } from 'lucide-react'
import { $Enums } from '@prisma/client'

const STATUS_STYLES: Record<$Enums.ProgressStatus, string> = {
  LEARNING: 'bg-[#7857FF] text-white',
  BUILDING: 'bg-[#C7FF3D] text-[#111111]',
  STUCK: 'bg-[#111111] text-[#F6F5EF]',
  WIN: 'bg-[#C7FF3D] text-[#111111]',
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const currentUser = await getCurrentUser()
  
  const { success, profile, isFollowing, trails = [] } = await getUserProfile(username)

  if (!success || !profile) {
    notFound()
  }

  const isOwnProfile = currentUser?.id === profile.id

  const initials = profile.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.username.slice(0, 2).toUpperCase()

  return (
    <StaggerContainer className="space-y-12">
      {/* Profile Header */}
      <StaggerItem className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between border-b border-[#111111]/[0.08] dark:border-white/10 pb-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <UserAvatar avatarUrl={profile.avatarUrl} name={profile.name} username={profile.username} size="xl" className="shadow-lg" />
          <div className="space-y-3">
            <div>
              <h1 className="font-heading text-[32px] font-semibold text-[#111111] dark:text-[#FFFFFF] leading-none">
                {profile.name}
              </h1>
              <p className="mt-1 text-[15px] font-medium text-[#737373] dark:text-[#A1A1AA]">
                @{profile.username}
              </p>
            </div>
            {profile.bio && (
              <p className="max-w-md text-[14px] leading-relaxed text-[#111111] dark:text-[#F6F5EF]">
                {profile.bio}
              </p>
            )}
            <div className="flex items-center gap-4 text-[13px] text-[#737373] dark:text-[#A1A1AA] pt-1">
              <TransitionLink href={`/profile/${profile.username}/followers`} className="flex items-center gap-1 hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors">
                <span className="font-semibold text-[#111111] dark:text-[#FFFFFF]">{profile._count.followers}</span>
                <span>Followers</span>
              </TransitionLink>
              <TransitionLink href={`/profile/${profile.username}/following`} className="flex items-center gap-1 hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors">
                <span className="font-semibold text-[#111111] dark:text-[#FFFFFF]">{profile._count.following}</span>
                <span>Following</span>
              </TransitionLink>
            </div>
          </div>
        </div>

        {!isOwnProfile && currentUser && (
          <div className="shrink-0">
            <FollowButton targetUserId={profile.id} initialFollowing={isFollowing || false} />
          </div>
        )}
      </StaggerItem>

      {/* Public Trails */}
      <StaggerItem className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C7FF3D]" />
          <h2 className="font-heading text-[13px] font-semibold tracking-[0.14em] text-[#111111] dark:text-[#FFFFFF] uppercase">
            Public Trails ({profile._count.trails})
          </h2>
        </div>

        {trails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#111111]/15 dark:border-white/15 bg-white/40 dark:bg-[#16171A]/40 p-12 md:p-16 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#111111]/5 dark:bg-white/5 text-[#737373] dark:text-[#A1A1AA]">
              <Compass className="h-6 w-6" />
            </div>
            <p className="text-[14.5px] leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
              @{profile.username} has no public trails yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trails.map((trail) => {
              const entryCount = trail._count.entries
              const sparkCount = trail._count.sparks
              const commentCount = trail._count.comments
              const latestEntry = trail.entries?.[0]

              return (
                <TransitionLink
                  key={trail.id}
                  href={`/trails/${trail.id}?from=profile&username=${profile.username}`}
                  className="group flex flex-col justify-between h-full rounded-2xl border border-[#111111]/[0.08] dark:border-white/10 bg-white dark:bg-[#16171A] p-6 hover:border-[#7857FF]/50 transition-all duration-200 shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-[#111111]/[0.06] dark:border-white/5 pb-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.08em] ${STATUS_STYLES[trail.status]}`}
                      >
                        {trail.status}
                      </span>
                    </div>

                    <div className="pt-1">
                      <h3 className="font-heading text-[18px] font-semibold text-[#111111] dark:text-[#FFFFFF] group-hover:text-[#7857FF] transition-colors leading-snug line-clamp-2">
                        {trail.title}
                      </h3>
                      {trail.category && (
                        <span className="mt-2 inline-block text-[11px] font-medium text-[#7857FF]">
                          #{trail.category}
                        </span>
                      )}
                    </div>

                    {latestEntry && (
                      <div className="rounded-xl border border-[#111111]/[0.06] dark:border-white/5 bg-[#FAFAFA] dark:bg-[#1A1C20] p-3 text-[12px] text-[#737373] dark:text-[#A1A1AA]">
                        <span className="line-clamp-2">{latestEntry.content}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#111111]/[0.06] dark:border-white/5 flex items-center justify-between text-[11.5px] text-[#737373] dark:text-[#A1A1AA]">
                    <div className="flex items-center gap-3.5">
                      <span className="inline-flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" />
                        <span>{sparkCount}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{commentCount}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{entryCount}</span>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 font-semibold text-[#7857FF] group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </TransitionLink>
              )
            })}
          </div>
        )}
      </StaggerItem>
    </StaggerContainer>
  )
}
