import { CreateGigForm } from '@/features/gigs/components/createGigForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gigs/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <CreateGigForm />
    </div>
  )
}
