import { PageTransition } from '@/components/animations/page-transition'

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}
