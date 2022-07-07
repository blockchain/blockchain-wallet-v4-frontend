import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'
import { DeepLinkHandler, DeepLinkListener } from 'services/deepLinkListener'
import { NabuErrorDeepLinkActions } from 'services/errors'

import { NabuErrorDeepLinkHandlerComponent } from './NabuErrorDeepLinkHandler.types'

export const NabuErrorDeepLinkHandler: NabuErrorDeepLinkHandlerComponent = ({ children }) => {
  const dispatch = useDispatch()
  const cryptoCurrency = useSelector(selectors.components.buySell.getCryptoCurrency)
  const fiatCurrency = useSelector(selectors.components.buySell.getFiatCurrency)
  const pair = useSelector(selectors.components.buySell.getBSPair)

  const handlers: Record<NabuErrorDeepLinkActions, DeepLinkHandler> = {
    [NabuErrorDeepLinkActions.BACK_TO_ENTER_AMOUNT]: () => {
      if (!cryptoCurrency || !fiatCurrency || !pair) return

      dispatch(
        actions.components.buySell.setStep({
          cryptoCurrency,
          fiatCurrency,
          pair,
          step: 'ENTER_AMOUNT'
        })
      )
    },
    [NabuErrorDeepLinkActions.OPEN_CONTACT_CUSTOMER_SUPPORT]: () => {
      window.open('https://support.blockchain.com')
    },
    [NabuErrorDeepLinkActions.OPEN_KYC]: () => {
      dispatch(
        actions.components.buySell.setStep({
          step: 'KYC_REQUIRED'
        })
      )
    },
    [NabuErrorDeepLinkActions.TRY_DIFFERENT_CARD]: () => {
      if (!cryptoCurrency || !fiatCurrency || !pair) return

      dispatch(
        actions.components.buySell.setStep({
          cryptoCurrency,
          fiatCurrency,
          pair,
          step: 'LINKED_PAYMENT_ACCOUNTS'
        })
      )
    },
    [NabuErrorDeepLinkActions.TRY_DIFFERENT_PAYMENT_METHOD]: () => {
      if (!cryptoCurrency || !fiatCurrency || !pair) return

      dispatch(
        actions.components.buySell.setStep({
          cryptoCurrency,
          fiatCurrency,
          pair,
          step: 'PAYMENT_METHODS'
        })
      )
    }
  }

  return <DeepLinkListener handlers={handlers}>{children}</DeepLinkListener>
}
