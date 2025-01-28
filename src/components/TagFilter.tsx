'use client'

type TagFilterProps = {
  currentTag: string;
  onTagChange: (tag: string) => void;
}

export default function TagFilter({ currentTag, onTagChange }: TagFilterProps) {
  return (
    <div className="mb-2 flex justify-start gap-4">
      <button
        onClick={() => onTagChange('all')}
        className={`px-2 py-1 text-sm rounded ${
          currentTag === 'all' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        All ToDo
      </button>
      <button
        onClick={() => onTagChange('personal')}
        className={`px-2 py-1 text-sm rounded ${
          currentTag === 'personal' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        Personal
      </button>
      <button
        onClick={() => onTagChange('work')}
        className={`px-2 py-1 text-sm rounded ${
          currentTag === 'work' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        Work
      </button>
      <button
        onClick={() => onTagChange('completed')}
        className={`px-2 py-1 text-sm rounded ${
          currentTag === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        Completed
      </button>
    </div>
  )
}