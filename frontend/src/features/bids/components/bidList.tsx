//* bid list
import React from 'react'
import { BidCard } from './bidCard'
import type { Bid } from '../types'

interface BidListProps {
  bids: Bid[] 
}

export const BidList: React.FC<BidListProps> = ({ bids }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
      {bids && bids.length > 0 ? bids.map((bid) => (
        <BidCard
          key={bid.id}
          id={bid.id.toString()}
          gigTitle={bid.gigTitle}
          message={bid.message}
          status={bid.status}
        />
      )) : <p>No bids available.</p>}
    </div>
  )
}