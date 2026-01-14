// create gig form
import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/apiClient'

export const CreateGigForm: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState(0)
  const queryClient = useQueryClient()

  const createGigMutation = useMutation({
    mutationFn: async (newGig: { title: string; description: string; budget: number }) => {
      const response = await api.post('/gigs', newGig)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] })
      setTitle('')
      setDescription('')
      setBudget(0)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createGigMutation.mutate({ title, description, budget })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Gig</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Budget ($)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={createGigMutation.isPending}
      >
        {createGigMutation.isPending ? 'Creating...' : 'Create Gig'}
      </button>
      {createGigMutation.isError && (
        <p className="text-red-500 mt-4">Error creating gig. Please try again.</p>
      )}
    </form>
  )
}