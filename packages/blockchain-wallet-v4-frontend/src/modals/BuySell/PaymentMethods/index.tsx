import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BSOrderActionType, BSPairType, FiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { selectors } from 'data'
import { brokerage, buySell } from 'data/components/actions'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { useRemote } from 'hooks'

import Loading from '../template.loading'
import Methods from './Methods'
import getData, { PaymentMethodsSelectorType } from './selectors'
import Unsupported from './template.unsupported'

const PaymentMethods = (props) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const fiatCurrency = useSelector(selectors.components.buySell.getFiatCurrency) ?? 'USD'
  const dispatch = useDispatch()

  const errorCallback = () => {
    dispatch(
      buySell.setStep({
        cryptoCurrency: 'BTC',
        fiatCurrency,
        pair: props.pair,
        step: getEnterAmountStepType(props.orderType)
      })
    )
  }

  useEffect(() => {
    if (isNotAsked || error) {
      dispatch(buySell.fetchFiatEligible(fiatCurrency))
      dispatch(buySell.fetchPaymentMethods(fiatCurrency))
      dispatch(buySell.fetchCards(false))
      dispatch(brokerage.fetchBankTransferAccounts())
    }
  }, [])

  if (error) {
    return (
      <FlyoutOopsError
        action='retry'
        handler={errorCallback}
        data-e2e='sbTryCurrencySelectionAgain'
      />
    )
  }

  if (isLoading || isNotAsked || !data) return <Loading />

  const isUserEligible = data.paymentMethods.methods?.find((method) => method.limits.max !== '0')

  return isUserEligible ? <Methods {...data} {...props} /> : <Unsupported {...data} {...props} />
}

export type LinkStatePropsType = PaymentMethodsSelectorType & {
  fiatCurrency: undefined | FiatType
}
export type Props = {
  handleClose: () => void
  orderType: BSOrderActionType
  pair: BSPairType
}

export default PaymentMethods
