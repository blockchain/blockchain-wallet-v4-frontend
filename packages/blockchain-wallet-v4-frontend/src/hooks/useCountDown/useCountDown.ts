import { useEffect, useRef, useState } from 'react'
import { differenceInMilliseconds, format } from 'date-fns'

const COMPLETING_SOON_OFFSET = 3000

const getDifference = (targetDate) => differenceInMilliseconds(targetDate, new Date())

const getIsCompletingSoon = (ms: number) => ms <= COMPLETING_SOON_OFFSET

const getPercentage = (value: number, total: number) => {
  if (total === 0 || value <= 0) {
    return 100
  }

  return Math.ceil(((total - value) * 100) / total)
}

const getTimer = (ms: number) => format(ms, 'mm:ss')

const getIsCompleted = (ms: number) => ms <= 0

export const useCountDown = (date: Date, totalMs: number) => {
  const [currentMs, setCurrentMs] = useState(() => getDifference(date))
  const intervalRef = useRef<number>()

  useEffect(() => {
    setCurrentMs(getDifference(date))

    intervalRef.current = window.setInterval(() => {
      const difference = getDifference(date)

      setCurrentMs(difference)
      if (difference <= 0) {
        window.clearInterval(intervalRef.current)
      }
    }, 1000)

    return () => window.clearInterval(intervalRef.current)
  }, [date])

  return {
    isCompleted: getIsCompleted(currentMs),
    isCompletingSoon: getIsCompletingSoon(currentMs),
    percentage: getPercentage(currentMs, totalMs),
    timer: getTimer(currentMs)
  }
}
