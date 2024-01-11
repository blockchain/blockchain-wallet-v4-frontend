import { useEffect, useState } from 'react'
import { formatDuration, intervalToDuration } from 'date-fns'

const zeroPad = (num) => String(num).padStart(2, '0')

const formattedCountdown = (duration: Duration) =>
  formatDuration(duration, {
    delimiter: ':',
    format: ['hours', 'minutes', 'seconds'],
    locale: {
      formatDistance: (_token, count) => zeroPad(count)
    },
    zero: true
  })

const getDurationTo = (target) => intervalToDuration({ end: new Date(target), start: new Date() })

export const useCountdownTo = (targetDate: string) => {
  const [countDown, setCountDown] = useState(getDurationTo(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(getDurationTo(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return formattedCountdown(countDown)
}
