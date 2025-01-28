import TaskList from '@/components/TaskList'
import TaskForm from '@/components/TaskForm'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Ben's Task Tracker</h1>
      <TaskList />
    </main>
  )
}