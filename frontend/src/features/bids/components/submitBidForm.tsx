
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/components/ui/dialog"
import { api } from "@/shared/lib/apiClient"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
interface SubmitBidFormProps {
  gigId: string
  freelancerId: string
}

const SubmitBidForm = ({ gigId, freelancerId }: SubmitBidFormProps) => {
  const [message, setMessage] = useState('')
  const mutate = useMutation({
    mutationFn: async (newBid: { gigId: string; freelancerId: string; message: string }) => {
      const response = await api.post('/bids', newBid);
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch bids query here if needed

    },
  })
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle bid submission logic here
    mutate.mutate({
      gigId,
      message,
      freelancerId
    })
  }
  return (
    <Dialog>
      <DialogTrigger>Bid</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a Bid</DialogTitle>
          <form onSubmit={onSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full px-3 py-2 border rounded"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <DialogClose asChild>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit Bid
              </button>
            </DialogClose>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SubmitBidForm