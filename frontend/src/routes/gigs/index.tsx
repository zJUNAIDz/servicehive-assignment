import { Button } from "@/components/ui/button";
import { GigList } from "@/features/gigs/components/gigList";
import { api } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute('/gigs/')({
  component: Gigs,
})

function Gigs() {
  const { data: gigs = [], isLoading, error } = useQuery({
    queryKey: ['gigs'],
    queryFn: async () => {
      const response = await api.get('/gigs');
      return response.data;
    }
  });
  // console.log({gigs});
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Gigs</h1>
      <Link to="/gigs/new">
        <Button>New Gig</Button>
      </Link>
      {
        isLoading && <p>Loading gigs...</p>
      }
      {
        error && <p>Error loading gigs: {(error as Error).message}</p>
      }
      {
        gigs && gigs.length === 0 && !isLoading && !error && <p>No gigs available.</p>
      }
      {
        gigs && gigs.length > 0 && !isLoading && !error && <GigList gigs={gigs} />
      }
    </div>
  )
}