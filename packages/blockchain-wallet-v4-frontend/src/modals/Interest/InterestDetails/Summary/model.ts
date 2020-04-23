const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const getNextMonth = (): string => {
  const current = new Date()
  const next =
    current.getMonth() === 11
      ? new Date(current.getFullYear() + 1, 0, 1)
      : new Date(current.getFullYear(), current.getMonth() + 1, 1)

  return (
    months[next.getMonth()] + ' ' + next.getDate() + ', ' + next.getFullYear()
  )
}
