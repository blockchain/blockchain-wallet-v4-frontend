import moment from 'moment'

import { UseIsTodayHook } from './types'

export const useIsToday: UseIsTodayHook = (date) => {
  return moment(date).calendar().startsWith('Today')
}
