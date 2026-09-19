import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'
import { notFound, redirect } from 'next/navigation'
import { EditTrailForm } from '@/components/sparktrail/edit-trail-form'

export const dynamic = 'force-dynamic'

interface EditTrailPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTrailPage({ params }: EditTrailPageProps) {
  const { id } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const trail = await db.trail.findUnique({
    where: { id },
  })

  if (!trail) {
    notFound()
  }

  if (trail.userId !== currentUser.id) {
    redirect(`/trails/${id}`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 pt-24 pb-32">
      <EditTrailForm key={`${trail.id}-${trail.updatedAt.getTime()}`} trail={trail} />
    </div>
  )
}
