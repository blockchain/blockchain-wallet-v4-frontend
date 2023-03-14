import React, { useEffect, useState } from 'react'

export const useDebounce = <T>(val: T, delay: number): T => {
  const [debounceVal, setDebounceVal] = useState<T>(val)
  useEffect(() => {
    const handler = setTimeout(() => setDebounceVal(val), delay)

    return () => clearTimeout(handler)
  }, [delay, val])

  return debounceVal
}
