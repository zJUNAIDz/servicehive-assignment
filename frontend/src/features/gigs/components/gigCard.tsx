//* create gig card component
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import type { Gig } from '../types'
import { BidList } from '../../bids/components/bidList'
import SubmitBidForm from '../../bids/components/submitBidForm'
import type { User } from '@/shared/providers/auth-context'
import { cn } from '@/shared/lib/utils'
import { api } from '@/shared/lib/apiClient'

interface GigCardProps {
  gig: Gig
  currentUser: User
  onClick: () => void
}

export const GigCard: React.FC<GigCardProps> = ({
  gig: { id, title, description, budget, ownerId, status },
  currentUser,
  onClick,
}) => {
  const isOwner: boolean = currentUser.id === ownerId.toString();
  console.log({ isOwner, ownerId, currentUserId: currentUser.id });
  // console.log("Gig [id missing]: ", id);
  const { data: bids, isLoading, error, } = useQuery({
    queryKey: ['bids', id],
    queryFn: async () => {
      // Replace with actual API call to fetch bids for the gig
      const { data } = await api.get(`/bids/${id}`);
      return data;
    },
    enabled: isOwner
  })
  return (
    <div
      className={cn("border rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer", isOwner ? "bg-amber-300": "border-green-500", status === "assigned" && "bg-green-300")}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="text-lg font-bold">${budget.toFixed(2)}</div>
      <div className="text-sm text-gray-500">Owner: {ownerId}</div>
      <div className="text-sm text-gray-500">Status: {status}</div>
      {
        isLoading
        && <p>Loading bids...</p>
      }
      {
        error && <p>Error loading bids: {(error as Error).message}</p>
      }
      {
        isOwner ? (
          <BidList bids={bids} key={id} onBidClick={() => { }} />
        ) : (
          status === "open"
            ? <SubmitBidForm gigId={id} freelancerId={currentUser.id} />
            : <p>This Gig is closed</p>
        )
      }

    </div>
  )
}