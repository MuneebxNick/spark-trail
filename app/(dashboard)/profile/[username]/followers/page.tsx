import { getFollowers } from '@/actions/profile'
import { getCurrentUser } from '@/lib/auth/session'
import { notFound } from 'next/navigation'
import { StaggerContainer, StaggerItem } from '@/components/animations/page-transition'
import { TransitionLink } from '@/components/animations/route-transition'
import { UserList } from '@/components/sparktrail/user-list'
import { ArrowLeft } from 'lucide-react'

export default async function FollowersPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const currentUser = await getCurrentUser()
  
  const { success, users, profileUser, nextCursor } = await getFollowers(username)

  if (!success || !profileUser) {
    notFound()
  }

  return (
    <StaggerContainer className="space-y-10">
      <StaggerItem y={10}>
        <TransitionLink
          href={`/profile/${profileUser.username}`}
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-[#FFFFFF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to profile</span>
        </TransitionLink>
      </StaggerItem>

      <StaggerItem className="space-y-2 border-b border-[#111111]/[0.08] dark:border-white/10 pb-8">
        <h1 className="font-heading text-[32px] font-semibold text-[#111111] dark:text-[#FFFFFF] leading-none">
          Followers
        </h1>
        <p className="text-[15px] font-medium text-[#737373] dark:text-[#A1A1AA]">
          People following @{profileUser.username}
        </p>
      </StaggerItem>

      <StaggerItem>
        <UserList 
          initialUsers={users || []} 
          initialNextCursor={nextCursor} 
          currentUserId={currentUser?.id} 
          profileUsername={profileUser.username}
          listType="followers"
        />
      </StaggerItem>
    </StaggerContainer>
  )
}
