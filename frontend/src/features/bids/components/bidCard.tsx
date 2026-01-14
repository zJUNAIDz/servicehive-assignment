//* bid card component
import { Button } from '@/components/ui/button'
import { api } from '@/lib/apiClient'
import { cn } from '@/lib/utils'
import { QueryClient, useMutation } from '@tanstack/react-query'
import React from 'react'

interface BidCardProps {
  id: string
  gigTitle: string
  message: string
  status: "pending" | "hired" | "rejected"
  onClick: (id: string) => void
}

export const BidCard: React.FC<BidCardProps> = ({
  gigTitle,
  status,
  message,
  id,
}) => {
  const statusColors = {
    pending: 'text-yellow-500',
    hired: 'text-green-500',
    rejected: 'text-red-500',
  }
  const queryClient = new QueryClient();
  const mutate = useMutation({
    mutationFn: async (bidId: string) => {
      // Replace with actual API call to hire freelancer for the bid
      const { data } = await api.patch(`/bids/${bidId}/hire`);

      console.log(`Hiring freelancer for bid ${bidId}`);
      return data
    },
    onSuccess: () => {
      // invalidate or refetch queries if needed
      queryClient.invalidateQueries({ queryKey: ['bids', id] });
    },
  })
  return (
    <div
      className="border rounded-lg w-100 flex flex-col p-4 shadow hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-2">{gigTitle}</h3>
      <div className="mb-2">{message}</div>
      <div className={cn(`font-medium`, statusColors[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
      {
        status === "pending" && (

          <Button onClick={() => mutate.mutate(id)}>Hire</Button>
        )
      }
      {
        mutate.isPending && <p>Hiring freelancer...</p>
      }
      {
        mutate.isError && <p>Error hiring freelancer: {(mutate.error as Error).message}</p>
      }
      {
        mutate.isSuccess && <p>Freelancer hired successfully!</p>
      }
    </div>
  )
}