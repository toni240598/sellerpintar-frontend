'use client'

import { Skeleton } from '@/components/ui/skeleton'
import axios from '@/lib/axios'
import { handleApiError } from '@/lib/utils'
import { Folder, LayoutDashboard, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Project {
    id: string
    name: string
}

export default function Sidebar() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)
    const pathname = usePathname()
    const [projectName, setProjectName] = useState('')
    const [open, setOpen] = useState(false)

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/project')
            setProjects(res.data.data)
        } catch (err) {
            handleApiError(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const res = await axios.post('/project', { name: projectName })
            toast.success('Project berhasil dibuat')
            setOpen(false)
            setProjectName('')
            fetchProjects()
        } catch (err) {
            handleApiError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <>
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-4 space-y-6">
                {/* Header Menu */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Create Project
                    </button>
                </div>
                {/* Dashboard */}
                <nav className="space-y-2">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm ${pathname === '/dashboard'
                            ? 'bg-blue-100 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:text-black'
                            }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                </nav>

                {/* Project List */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Projects</h3>
                    <div className="space-y-1">
                        {loading ? (
                            <>
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                            </>
                        ) : (
                            projects.map((project) => {
                                const isActive = pathname === `/project/${project.id}`
                                return (
                                    <Link
                                        key={project.id}
                                        href={`/project/${project.id}`}
                                        className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm truncate ${isActive
                                            ? 'bg-blue-100 text-blue-600 font-semibold'
                                            : 'text-gray-700 hover:text-blue-600'
                                            }`}
                                        title={project.name}
                                    >
                                        <Folder className="w-4 h-4" />
                                        <span className="truncate">{project.name}</span>
                                    </Link>
                                )
                            })
                        )}
                    </div>
                </div>
            </aside>

            {/* Modal / Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Buat Project Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Nama Project"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            disabled={loading}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleSubmit} disabled={loading || !projectName.trim()} variant='blue' className='cursor-pointer'>
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}
