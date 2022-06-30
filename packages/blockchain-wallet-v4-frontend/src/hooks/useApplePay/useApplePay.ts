import { useMemo, useRef } from 'react'

import { selectors } from 'data'

import { useRemote } from '../useRemote'
import { ApplePayHook } from './useApplePay.types'
import { isApplePayAvailable } from './utils'

export const useApplePay: ApplePayHook = () => {
  const isAvailableRef = useRef<boolean>(isApplePayAvailable())

  const { data: applePayEnabled, isLoading } = useRemote(
    selectors.core.walletOptions.getApplePayAsNewPaymentMethod
  )

  const isFeatureFlagEnabled = useMemo(() => {
    return !isLoading && !!applePayEnabled
  }, [applePayEnabled, isLoading])

  return {
    isAvailable: isAvailableRef.current,
    isFeatureFlagEnabled
  }
}
