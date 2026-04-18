import { useState, useCallback } from 'react'

let id = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const toastId = ++id
    setToasts((prev) => [...prev, { id: toastId, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId))
    }, 3500)
  }, [])

  return { toasts, addToast }
}
