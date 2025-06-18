import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'
import { handleApiError } from '@/lib/utils';
import axios from '@/lib/axios'

interface AddTaskDialogProps {
    projectId: string;
    userId: string;
    ownerId: string;
    onTaskAdded?: (newTask: any) => void;
}

export function AddTaskDialog({ projectId, userId, ownerId, onTaskAdded }: AddTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/task', {
                ...formData,
                projectId,
            });
            toast.success(`Berhasil menambahkan task`);
            setOpen(false);
            setFormData({ title: '', description: '' });
            // Panggil callback jika tersedia
            if (onTaskAdded) {
                onTaskAdded(response.data);
            }
        } catch (err) {
            handleApiError(err)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    variant='blue'
                    className='cursor-pointer'
                    disabled={ownerId !== userId}
                >
                    <Plus className="h-4 w-4" />
                    Tambah Task
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buat Task Baru</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Task</Label>
                        <Input
                            id="title"
                            placeholder="Masukkan judul task"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            placeholder="Masukkan deskripsi task"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="blue"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                // <Loader className="mr-2 h-4 w-4 animate-spin" />
                                '...loading'
                            ) : (
                                'Simpan'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}