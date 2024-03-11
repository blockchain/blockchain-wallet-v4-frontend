import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BSOrderActionType, BSPairType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { selectors } from 'data'
import { brokerage, buySell } from 'data/components/actions'
import { getEnterAmountStepType } from 'data/components/buySell/utils'
import { useRemote } from 'hooks'

import Loading from '../template.loading'
import Success from './Accounts/index'
import { getData } from './selectors'

const PaymentMethods = (props) => {
  const dispatch = useDispatch()

  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const fiatCurrency = useSelector(selectors.components.buySell.getFiatCurrency)

  useEffect(() => {
    if (isNotAsked) {
      dispatch(buySell.fetchCards(false))
      dispatch(brokerage.fetchBankTransferAccounts())
    }
  }, [])

  const errorCallback = () => {
    dispatch(
      buySell.setStep({
        cryptoCurrency: 'BTC',
        fiatCurrency: fiatCurrency || 'USD',
        pair: props.pair,
        step: getEnterAmountStepType(props.orderType)
      })
    )
  }

  if (error) {
    return (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={errorCallback}
      />
    )
  }
  if (isLoading || isNotAsked || !data) return <Loading />
  return <Success {...data} {...props} fiatCurrency={fiatCurrency} />
}

export type PaymentMethodsProps = {
  handleClose: () => void
  orderType: BSOrderActionType
  pair: BSPairType
}

export default PaymentMethods
