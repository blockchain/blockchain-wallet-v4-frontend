import { useEffect, useRef } from 'react'

export const useDebounce = (
  { action, timeout }: { action: () => void; timeout: number },
  deps: unknown[]
) => {
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      action()
      searchTimeoutRef.current = null
    }, timeout)
  }, deps)
}
