import { PageTransition } from '@/components/animations/page-transition'

export default function AuthTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}
