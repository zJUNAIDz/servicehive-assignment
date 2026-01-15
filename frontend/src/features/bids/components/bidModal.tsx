// create simple bid modal compnent using shadcn dialog to enlist bids(using BidsList component) for a gig
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import type { Bid } from "../types"
import { BidList } from "./bidList"

interface BidModalProps {
  gigId: string
  bids: Bid[]
}

export const BidModal = ({ gigId, bids }: BidModalProps) => {
  return (
    <Dialog>
      <DialogTrigger className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        View Bids
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bids for Gig ID: {gigId}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <BidList bids={bids}/>
        </div>
        <DialogClose asChild>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default BidModal