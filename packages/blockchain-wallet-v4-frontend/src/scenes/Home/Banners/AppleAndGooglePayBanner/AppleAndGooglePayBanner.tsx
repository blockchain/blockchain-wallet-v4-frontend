import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { MobilePaymentType } from '@core/types'
import { actions, selectors } from 'data'
import { useApplePay, useRemote } from 'hooks'

import ANNOUNCEMENTS from '../constants'
import { AppleAndGooglePayBannerView } from './components'

export const AppleAndGooglePayBanner = () => {
  const dispatch = useDispatch()
  const { data: paymentMethods } = useRemote(selectors.components.buySell.getBSPaymentMethods)
  const { isAvailable: isApplePayAvailable, isFeatureFlagEnabled: isApplePayFeatureFlagEnabled } =
    useApplePay()

  const googlePay = useMemo(() => {
    return paymentMethods?.methods?.find((method) =>
      method.mobilePayment?.includes(MobilePaymentType.GOOGLE_PAY)
    )
  }, [paymentMethods])

  const applePay = useMemo(() => {
    return paymentMethods?.methods?.find((method) =>
      method.mobilePayment?.includes(MobilePaymentType.APPLE_PAY)
    )
  }, [paymentMethods])

  const onClickClose = useCallback(() => {
    return dispatch(actions.cache.announcementDismissed(ANNOUNCEMENTS.APPLE_GOOGLE_PAY))
  }, [dispatch])

  const handleOnClick = useCallback(() => {
    const isApplePayEnabled = isApplePayAvailable && isApplePayFeatureFlagEnabled

    const mobilePaymentMethod = isApplePayEnabled
      ? MobilePaymentType.APPLE_PAY
      : MobilePaymentType.GOOGLE_PAY

    const method = isApplePayEnabled ? applePay : googlePay

    dispatch(
      actions.components.buySell.showModal({
        cryptoCurrency: 'BTC',
        method,
        mobilePaymentMethod,
        orderType: 'BUY',
        origin: 'AppleAndGooglePayPromo'
      })
    )
  }, [applePay, googlePay, dispatch, isApplePayAvailable, isApplePayFeatureFlagEnabled])

  return <AppleAndGooglePayBannerView onClick={handleOnClick} onClickClose={onClickClose} />
}
