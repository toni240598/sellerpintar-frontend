'use client'

import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './Column'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { handleApiError } from '@/lib/utils'
import axios from '@/lib/axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
const columns = ['todo', 'in_progress', 'done'] as const

type Status = (typeof columns)[number]

export interface Task {
    id: string
    title: string
    description: string
    status: Status
    assigneeEmail: string | null
}


export default function KanbanBoard({ projectId, ownerId }: { projectId: string, ownerId: string }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const sensors = useSensors(useSensor(PointerSensor));
    const userId = Cookies.get('userId');

    const fetchTasks = async () => {
        try {
            const { data } = await axios.get(`/task/project/${projectId}`);
            setTasks(data.data);
        } catch (err) {
            handleApiError(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    
    const editStatusTask = async (taskId: string, status: Status) => {
        try {
            await axios.put(`/task/${taskId}/status`, { status });
            toast.success(`Berhasil update status task`);
            fetchTasks();
        } catch (err) {
            handleApiError(err)
            throw err; // Re-throw error untuk rollback di handleDragEnd
        }
    };

    // Update handleDragEnd untuk rollback jika error
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over) return;

        const taskId = active.id.toString();
        const overColumn = over.id.toString() as Status;
        const task = tasks.find(t => t.id === taskId);

        if (!task || overColumn === task.status) return;

        // Simpan status lama untuk rollback
        const originalStatus = task.status;

        // Optimistic update
        setTasks(prev =>
            prev.map(t =>
                t.id === taskId ? { ...t, status: overColumn } : t
            )
        );

        try {
            await editStatusTask(taskId, overColumn);
        } catch (err) {
            // Rollback jika error
            setTasks(prev =>
                prev.map(t =>
                    t.id === taskId ? { ...t, status: originalStatus } : t
                )
            );
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Task Board</h2>
                    <Button onClick={() => {/* Fungsi untuk menambahkan task */ }} variant='blue' className='cursor-pointer' disabled={ownerId !== userId}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Task
                    </Button>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {columns.map((status) => (
                            <SortableContext key={status} items={tasks.filter((t) => t.status === status)} strategy={rectSortingStrategy}>
                                <Column
                                    id={status}
                                    title={status}
                                    tasks={tasks.filter((t) => t.status === status)}
                                />
                            </SortableContext>
                        ))}
                    </div>
                </DndContext>
            </div>
        </div>
    )
}
