'use client'

import { useState } from 'react'

type TaskTag = 'work' | 'personal'
type TaskPriority = 'next' | 'someday'

export default function TaskForm({ onTaskAdded }: { onTaskAdded: () => Promise<void> }) {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState<TaskTag>('personal')
  const [priority, setPriority] = useState<TaskPriority>('next')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          tag,
          actionable: priority === 'next' ? 'nextaction' : 'somedaymaybe'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      setTitle('')
      await onTaskAdded()
    } catch (err) {
      setError('Failed to create task')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="flex gap-4 mb-1">
          <div className="inline-flex rounded overflow-hidden">
            <button
              type="button"
              onClick={() => setTag('work')}
              className={`px-2 py-1 w-20 text-sm whitespace-nowrap text-center ${
                tag === 'work' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Work
            </button>
            <button
              type="button"
              onClick={() => setTag('personal')}
              className={`px-2 py-1 w-20 text-sm whitespace-nowrap text-center ${
                tag === 'personal' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Personal
            </button>
          </div>
          <div className="inline-flex rounded overflow-hidden">
            <button
              type="button"
              onClick={() => setPriority('next')}
              className={`px-2 py-1 w-24 text-sm whitespace-nowrap text-center ${
                priority === 'next' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Next Action
            </button>
            <button
              type="button"
              onClick={() => setPriority('someday')}
              className={`px-2 py-1 w-24 text-sm whitespace-nowrap text-center ${
                priority === 'someday' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Someday
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new task..."
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  )
}