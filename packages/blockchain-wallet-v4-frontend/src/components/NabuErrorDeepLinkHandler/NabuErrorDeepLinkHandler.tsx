import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { DeepLinkClickState, DeepLinkHandler, DeepLinkListener } from 'services/deepLinkListener'
import { NabuErrorDeepLinkActions } from 'services/errors'

import { NabuErrorDeepLinkHandlerComponent } from './NabuErrorDeepLinkHandler.types'

export const NabuErrorDeepLinkHandler: NabuErrorDeepLinkHandlerComponent = ({ children }) => {
  const dispatch = useDispatch()
  const cryptoCurrency = useSelector(selectors.components.buySell.getCryptoCurrency)
  const fiatCurrency = useSelector(selectors.components.buySell.getFiatCurrency)
  const pair = useSelector(selectors.components.buySell.getBSPair)
  const orderType = useSelector(selectors.components.buySell.getOrderType)

  const goBackToEnterAmount = useCallback(() => {
    if (!cryptoCurrency || !fiatCurrency || !pair) return

    dispatch(
      actions.components.buySell.setStep({
        cryptoCurrency,
        fiatCurrency,
        pair,
        step: getEnterAmountStepType(orderType)
      })
    )
  }, [cryptoCurrency, dispatch, fiatCurrency, pair, orderType])

  const goToDashboard = useCallback(() => {
    dispatch(actions.modals.closeModal())

    dispatch(actions.router.push('/home'))
  }, [dispatch])

  const openContactCustomerSupport = useCallback(() => {
    window.open('https://support.blockchain.com')
  }, [])

  const openKYC = useCallback(() => {
    dispatch(
      actions.components.buySell.setStep({
        step: 'KYC_REQUIRED'
      })
    )
  }, [dispatch])

  const tryDifferentCard = useCallback(() => {
    dispatch(actions.components.buySell.createCardNotAsked())

    dispatch(
      actions.components.buySell.setStep({
        step: 'DETERMINE_CARD_PROVIDER'
      })
    )
  }, [dispatch])

  const tryDifferentPaymentMethod = useCallback(() => {
    if (!cryptoCurrency || !fiatCurrency || !pair) return

    dispatch(
      actions.components.buySell.setStep({
        cryptoCurrency,
        fiatCurrency,
        pair,
        step: 'LINKED_PAYMENT_ACCOUNTS'
      })
    )
  }, [cryptoCurrency, dispatch, fiatCurrency, pair])

  const actionToHandler: Record<NabuErrorDeepLinkActions, (url: URL) => void> = useMemo(
    () => ({
      [NabuErrorDeepLinkActions.BACK_TO_ENTER_AMOUNT]: goBackToEnterAmount,
      [NabuErrorDeepLinkActions.GO_TO_DASHBOARD]: goToDashboard,
      [NabuErrorDeepLinkActions.OPEN_CONTACT_CUSTOMER_SUPPORT]: openContactCustomerSupport,
      [NabuErrorDeepLinkActions.OPEN_KYC]: openKYC,
      [NabuErrorDeepLinkActions.TRY_DIFFERENT_CARD]: tryDifferentCard,
      [NabuErrorDeepLinkActions.TRY_DIFFERENT_PAYMENT_METHOD]: tryDifferentPaymentMethod
    }),
    [
      goBackToEnterAmount,
      goToDashboard,
      openContactCustomerSupport,
      openKYC,
      tryDifferentCard,
      tryDifferentPaymentMethod
    ]
  )

  const onClickDeepLinkHandler: DeepLinkHandler = useCallback(
    (link) => {
      const url = new URL(link)

      const handler = actionToHandler[url.pathname]

      if (handler) {
        handler(url)
      } else if (url.hostname.endsWith('blockchain.com')) {
        window.open(link, '_blank')
      } else {
        window.open(link, '_blank', 'noopener, noreferrer')
      }

      return DeepLinkClickState.handled
    },
    [actionToHandler]
  )

  return <DeepLinkListener onClickDeepLink={onClickDeepLinkHandler}>{children}</DeepLinkListener>
}
