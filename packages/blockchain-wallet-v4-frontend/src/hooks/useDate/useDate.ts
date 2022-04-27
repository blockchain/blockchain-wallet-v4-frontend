import { useMemo } from 'react'

import { UseDateHook } from './types'

export const useDate: UseDateHook = (value) =>
  useMemo(() => {
    return new Date(value)
  }, [value])
