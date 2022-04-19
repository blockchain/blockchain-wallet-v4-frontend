import { useMemo } from 'react'
import moment from 'moment'

import { UseDateFomatterHook } from './types'

export const useDateFomatter: UseDateFomatterHook = (date, pattern) =>
  useMemo(() => {
    return moment(date).format(pattern)
  }, [date, pattern])
