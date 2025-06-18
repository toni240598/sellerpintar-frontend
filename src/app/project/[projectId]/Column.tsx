'use client'

import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import { Task } from './KanbanBoard'

const statusLabels: Record<string, string> = {
  todo: '📝 Todo',
  in_progress: '🚧 In Progress',
  done: '✅ Done',
}

export default function Column({ id, title, tasks }: {
  id: string
  title: string
  tasks: Task[]
}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded shadow min-h-[300px]">
      <h3 className="text-md font-semibold mb-3">{statusLabels[title]}</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
