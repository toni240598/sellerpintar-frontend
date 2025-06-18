'use client'

import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import { handleApiError } from '@/lib/utils'

export default function Header() {
    const router = useRouter()
    const [email, setEmail] = useState('')

    const checkAuth = async () => {
        try {
            const res = await axios.get('/verify-token')
            setEmail(res.data.data.email)
        } catch (err) {
            handleApiError(err)
            router.push('/login')
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const handleLogout = () => {
        Cookies.remove('token')
        Cookies.remove('userId')
        toast.success('Berhasil logout')
        router.push('/login')
    }

    return (
        <header className="w-full flex justify-between items-center p-4 border-b shadow-sm bg-white">
            <h1 className="text-xl font-semibold">👋 Selamat Datang {email}</h1>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 cursor-pointer"
            >
                <LogOut className="h-5 w-5" />
            </Button>
        </header>
    )
}
