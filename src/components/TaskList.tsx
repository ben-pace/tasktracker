'use client'

import { useState, useEffect } from 'react'
import TagFilter from './TagFilter'
import TaskForm from './TaskForm'
import CompletionHistory from './CompletionHistory'

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  tag: 'personal' | 'work';
  dateCompleted?: string;
  dateCreated: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentTag, setCurrentTag] = useState('all')  // This is already the default
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
      setError('')
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete task')
      }
      await fetchTasks() // Refresh the list
    } catch (err) {
      console.error('Failed to delete task:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  const toggleStatus = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          dateCompleted: newStatus === 'completed' ? new Date().toLocaleDateString() : null
        }),
      })
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update task')
      }
      
      await fetchTasks()
    } catch (err) {
      console.error('Failed to update task:', err)
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const filteredTasks = tasks
  .filter(task => {
    if (currentTag === 'completed') return task.status === 'completed';
    if (currentTag === 'all') return task.status === 'pending';
    return task.tag === currentTag && task.status === 'pending';
  })
  .sort((a, b) => {
    if (currentTag === 'completed' && a.dateCompleted && b.dateCompleted) {
      return new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime();
    }
    return 0;
  });

  const getDaysOld = (task: Task) => {
    // Strip time information by only using year/month/day
    const createdDate = new Date(task.dateCreated);
    const createdDay = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      createdDate.getDate()
    );
    
    const today = new Date();
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    console.log('Created day:', createdDay);
    console.log('Today day:', todayDay);
    
    // Calculate days between dates
    const yearDiff = todayDay.getFullYear() - createdDay.getFullYear();
    const monthDiff = todayDay.getMonth() - createdDay.getMonth();
    const dayDiff = todayDay.getDate() - createdDay.getDate();
    
    return (yearDiff * 365) + (monthDiff * 30) + dayDiff;
  };

  if (loading) {
    return <div className="text-center">Loading tasks...</div>
  }

  return (
    <>
      <CompletionHistory tasks={tasks} />
      <div className="my-12">
        <TaskForm onTaskAdded={fetchTasks} />
      </div>
      <div className="my-12">
        <TagFilter currentTag={currentTag} onTagChange={setCurrentTag} />
        <div className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet</p>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-center bg-white rounded shadow"
              >
                <div className="flex-1 flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <span className={task.status === 'completed' ? 'text-gray-500' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {task.status === 'completed' ? (
                      <span className="text-gray-500">
                        Completed: {new Date(task.dateCompleted!).toLocaleDateString()}
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleStatus(task)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Done
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {!task.status || task.status === 'pending' ? (
                  <div className="bg-red-100 text-red-600 px-4 py-4 flex items-center justify-center border-l">
                    <div className="text-center">
                      <div className="text-lg font-bold">{getDaysOld(task)}</div>
                      <div className="text-xs">days old</div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}