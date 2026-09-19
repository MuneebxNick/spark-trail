import { requireAuth } from '@/lib/auth/session'
import { SettingsForm } from '@/components/sparktrail/settings-form'

export default async function SettingsPage() {
  const user = await requireAuth()

  return <SettingsForm user={user} />
}
