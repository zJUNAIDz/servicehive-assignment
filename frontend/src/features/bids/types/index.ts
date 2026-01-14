export interface Bid {
  id: number
  gigTitle: string
  amount: number
  status: "pending" | "hired" | "rejected"
  message: string
}