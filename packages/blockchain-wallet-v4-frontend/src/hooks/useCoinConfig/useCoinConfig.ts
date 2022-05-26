import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CoinConfigHook } from './useCoinConfig.types'

export const useCoinConfig: CoinConfigHook = ({ coin }) => {
  const intervalRef = useRef<NodeJS.Timeout>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const data = useMemo(() => {
    if (isLoading) return undefined

    return window.coins[coin].coinfig
  }, [coin, isLoading])

  const clearInterval = useCallback(() => {
    const interval = intervalRef.current

    if (interval) {
      window.clearInterval(interval)

      intervalRef.current = undefined
    }
  }, [intervalRef])

  const checkForCoinsData = useCallback(() => {
    if (window.coins) {
      setIsLoading(false)

      clearInterval()
    }
  }, [clearInterval])

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(checkForCoinsData, 0)
    }

    return clearInterval
  }, [clearInterval, checkForCoinsData])

  return {
    data,
    isLoading
  }
}
