import { useMemo } from 'react'
import { format } from 'date-fns'

import { UseDateFormatterHook } from './types'

export const useDateFormatter: UseDateFormatterHook = (date, pattern) =>
  useMemo(() => {
    return format(new Date(date), pattern)
  }, [date, pattern])
