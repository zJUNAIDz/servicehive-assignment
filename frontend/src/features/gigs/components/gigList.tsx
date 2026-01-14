//* gig list component
import React from 'react'
import { GigCard } from './gigCard'
import type { Gig } from '../types'
import { useAuth } from '@/lib/auth-context'

interface GigListProps {
  gigs: Gig[]
}

export const GigList: React.FC<GigListProps> = ({ gigs }) => {
  // console.log("Rendering GigList with gigs:", gigs);
  const { isAuthenticated, isLoading, isError, user } = useAuth();
  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>error</div>;
  }
  if (!isAuthenticated || !user) {
    return <div>Please log in to view gigs.</div>;
  }
  console.log({ user });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map((gig) => (
        <GigCard
          key={gig.id}
          gig={gig}
          currentUser={user}
          onClick={() => { }}
        />
      ))}
    </div>
  )
}