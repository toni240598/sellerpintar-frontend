'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import { Task } from './KanbanBoard'

export default function TaskCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    })

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <Card className={cn('cursor-move')}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500">
                        {task.assigneeEmail ? `👤 ${task.assigneeEmail}` : 'Belum ditugaskan'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
