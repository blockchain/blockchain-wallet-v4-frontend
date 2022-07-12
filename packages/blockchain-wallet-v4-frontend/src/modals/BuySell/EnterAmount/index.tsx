import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import {
  BSOrderActionType,
  BSOrderType,
  BSPairType,
  BSPaymentMethodType,
  ExtractSuccess,
  MobilePaymentType
} from '@core/types'
import { BuySellLimitReached } from 'components/Flyout/Brokerage'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { ClientErrorProperties, PartialClientErrorProperties } from 'data/analytics/types/errors'
import { DEFAULT_BS_METHODS } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../template.loading'
import getData from './selectors'
import Success from './template.success'

const EnterAmount = (props: Props) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    if (props.fiatCurrency && !data) {
      props.buySellActions.fetchPaymentMethods(props.fiatCurrency)
      props.buySellActions.fetchFiatEligible(props.fiatCurrency)
      props.buySellActions.fetchPairs({
        coin: props.cryptoCurrency,
        currency: props.fiatCurrency
      })
      props.brokerageActions.fetchBankTransferAccounts()
      props.buySellActions.fetchCards(false)
      props.buySellActions.fetchSDDEligibility()
    }

    // data was successful but paymentMethods was DEFAULT_BS_METHODS
    if (props.fiatCurrency && data) {
      if (equals(data.paymentMethods, DEFAULT_BS_METHODS)) {
        props.buySellActions.fetchPaymentMethods(props.fiatCurrency)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const errorCallback = () => {
    props.buySellActions.setStep({
      fiatCurrency: props.fiatCurrency || 'USD',
      step: 'CRYPTO_SELECTION'
    })
  }

  const trackError = useCallback(
    (error: PartialClientErrorProperties) => {
      props.analyticsActions.trackEvent({
        key: Analytics.CLIENT_ERROR,
        properties: {
          ...error,
          action: props.orderType,
          error: 'OOPS_ERROR',
          title: 'Oops! Something went wrong'
        } as ClientErrorProperties
      })
    },
    [props.analyticsActions, props.orderType]
  )

  useEffect(() => {
    trackError(error)
  }, [error, trackError])

  if (error) {
    return (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={errorCallback}
        errorMessage={error.title}
      />
    )
  }

  if (isLoading) {
    return <Loading />
  }

  if (isNotAsked) {
    return null
  }

  if (!data) {
    return null
  }

  const userHitMaxPendingDeposits =
    data.eligibility.maxPendingDepositSimpleBuyTrades ===
    data.eligibility.pendingDepositSimpleBuyTrades

  if (userHitMaxPendingDeposits) {
    return (
      <BuySellLimitReached
        handleClose={props.handleClose}
        limitNumber={data.eligibility.maxPendingDepositSimpleBuyTrades}
      />
    )
  }

  return <Success {...data} {...props} />
}

const mapStateToProps = (state: RootState) => ({
  cryptoCurrency: selectors.components.buySell.getCryptoCurrency(state) || 'BTC',
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method?: BSPaymentMethodType
  mobilePaymentMethod?: MobilePaymentType
  order?: BSOrderType
  orderType: BSOrderActionType
  pair: BSPairType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
