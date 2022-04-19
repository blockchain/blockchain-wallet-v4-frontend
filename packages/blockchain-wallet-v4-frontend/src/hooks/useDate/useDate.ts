import { useMemo } from 'react'
import moment from 'moment'

import { UseDateHook } from './types'

export const useDate: UseDateHook = (value) =>
  useMemo(() => {
    return moment(value).toDate()
  }, [value])
