import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleApiError(err: any, fallbackMessage = "Terjadi kesalahan") {
  const data = err?.response?.data

  if (!data) {
    toast.error(fallbackMessage)
    return
  }

  // Jika bentuknya: { message: "..." }
  if (typeof data.message === "string") {
    toast.error(data.message)
    return
  }

  // Jika bentuknya: { errors: ["...", "..."] }
  if (Array.isArray(data.errors)) {
    for (const err of data.errors) {
      toast.error(err.message)
    }
    return
  }

  toast.error(fallbackMessage)
}

