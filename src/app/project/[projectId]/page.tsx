'use client'

import MainLayout from '@/components/MainLayout'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import axios from '@/lib/axios'
import { handleApiError } from '@/lib/utils'
import Cookies from 'js-cookie'
import { Pencil } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import KanbanBoard from './KanbanBoard'

interface Member {
  id: string
  email: string
  isMember: boolean
}

interface Project {
  id: string
  name: string
  ownerId: string
  owner: { email: string }
  members: Member[]
}



export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const userId = Cookies.get('userId')
  const [projectName, setProjectName] = useState('')
  const [openProjectDialog, setOpenProjectDialog] = useState(false)

  const fetchProject = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/project/${projectId}`)
      setProject(res.data.data)
      setProjectName(res.data.data.name)
    } catch (err) {
      handleApiError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProject = async () => {
    try {
      setLoading(true)
      await axios.put(`/project/${project?.id}`, { name: projectName })
      toast.success('Project berhasil diedit')
      setOpenProjectDialog(false)
      setProjectName('')
      fetchProject()
    } catch (err) {
      handleApiError(err)
    }
  }

  const handleAddMember = async (email: string) => {
    try {
      const res = await axios.post('/project/invite', {
        projectId,
        email,
      })
      toast.success(`Berhasil mengundang ${email}`)
      fetchProject()
    } catch (err) {
      handleApiError(err)
    }
  }

  useEffect(() => {
    if (projectId) fetchProject()
  }, [projectId])

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Detail Project</h1>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : project ? (
          <>
            {/* main content */}
            <div className="bg-white shadow rounded p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{project.name}</h2>
                  <p className="text-sm text-gray-500">Project ID: {project.id}</p>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="green"
                          size="icon"
                          className="cursor-pointer"
                          disabled={userId !== project.ownerId}
                          onClick={() => setOpenProjectDialog(true)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit detail project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-700">Owner</h3>
                <p className="text-sm text-gray-600">{project.owner.email}</p>
              </div>

              <h3 className="text-md font-semibold text-gray-800 mb-4">Daftar Member</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="w-12 text-left text-sm font-medium text-gray-700 px-3 py-2 border">No</th>
                      <th className="text-left text-sm font-medium text-gray-700 px-4 py-2 border">Email</th>
                      <th className="text-left text-sm font-medium text-gray-700 px-4 py-2 border">Status</th>
                      <th className="w-32 text-left text-sm font-medium text-gray-700 px-4 py-2 border">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.members.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-2 border text-sm text-gray-800">{user.email}</td>
                        <td className="px-4 py-2 border text-sm">
                          {user.isMember ? (
                            <span className="text-green-600 font-medium">✔ Sudah Bergabung</span>
                          ) : (
                            <span className="text-red-500 font-medium">✖ Belum</span>
                          )}
                        </td>
                        <td className="px-4 py-2 border text-sm">
                          {!user.isMember ? (
                            <Button
                              size="sm"
                              onClick={() => handleAddMember(user.email)}
                              variant='blue'
                              className='cursor-pointer'
                              disabled={project.ownerId !== userId}
                            >
                              Tambahkan
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-xs italic">Tidak tersedia</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <KanbanBoard projectId={projectId} ownerId={project.ownerId}></KanbanBoard>

            {/* dialog */}
            <Dialog open={openProjectDialog} onOpenChange={setOpenProjectDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nama Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    disabled={loading}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleEditProject} disabled={loading || !projectName.trim()} variant='blue' className='cursor-pointer'>
                      {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p className="text-red-500">Project tidak ditemukan</p>
        )}
      </div>
    </MainLayout>
  )
}
