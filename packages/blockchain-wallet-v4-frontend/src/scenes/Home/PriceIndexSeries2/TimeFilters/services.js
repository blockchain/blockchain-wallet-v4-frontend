import { assoc } from 'ramda'

export const selectTimeStyle = time => {
  const initial = {
    day: { underline: false, color: 'gray-3' },
    week: { underline: false, color: 'gray-3' },
    month: { underline: false, color: 'gray-3' },
    year: { underline: false, color: 'gray-3' },
    all: { underline: false, color: 'gray-3' }
  }
  return assoc(time, { underline: true, color: 'brand-primary' }, initial)
}
