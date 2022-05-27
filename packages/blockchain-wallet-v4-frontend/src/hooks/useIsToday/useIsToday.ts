import { isToday } from 'date-fns'

import { UseIsTodayHook } from './types'

export const useIsToday: UseIsTodayHook = (date) => {
  return isToday(new Date(date))
}
