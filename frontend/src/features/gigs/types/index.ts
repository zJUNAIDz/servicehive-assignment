export interface Gig {
  id: string
  title: string
  description: string
  budget: number
  ownerId: number
  status: 'open' | 'assigned'
}