import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Exchange, Remote } from '@core'
import {
  BSOrderType,
  BSPaymentMethodType,
  ExtractSuccess,
  OrderType,
  RemoteDataType
} from '@core/types'
import DataError from 'components/DataError'
import { OrderSummary } from 'components/Flyout/Brokerage'
import { getPeriodForSuccess } from 'components/Flyout/model'
import { actions, model, selectors } from 'data'
import {
  getBaseAmount,
  getBaseCurrency,
  getCounterAmount,
  getCounterCurrency,
  getOrderType
} from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import {
  BSCheckoutFormValuesType,
  RecurringBuyOrigins,
  RecurringBuyPeriods,
  RecurringBuyStepType
} from 'data/types'

import Loading from '../template.loading'
import InterestBanner from './InterestBanner'
import { getData } from './selectors'
import SuccessSdd from './template.sdd.success'

const { getSymbol } = Exchange
const { FORM_BS_CHECKOUT } = model.components.buySell

class OrderSummaryContainer extends PureComponent<Props> {
  componentDidMount() {
    if (!Remote.Success.is(this.props.data)) {
      this.props.buySellActions.fetchCards(false)
      this.props.sendActions.getLockRule()
      this.props.recurringBuyActions.fetchRegisteredList()
      this.props.recurringBuyActions.fetchPaymentInfo()
    }

    this.props.buySellActions.fetchOrders()

    this.props.interestActions.fetchShowInterestCardAfterTransaction({})
  }

  handleOkButton = () => {
    // this recurring buy flow is for first time buyers only. They'll have 1 tx at this point in the flow and
    // they didn't already create a recurring buy buy so we send them to RB walkthrough flow
    if (
      this.props.hasAvailablePeriods &&
      this.props.isRecurringBuy &&
      this.props.orders.length <= 1 &&
      this.props.formValues?.period === RecurringBuyPeriods.ONE_TIME &&
      this.props.hasQuote
    ) {
      this.props.recurringBuyActions.showModal({
        origin: RecurringBuyOrigins.SIMPLE_BUY_ORDER_SUMMARY
      })
      this.props.recurringBuyActions.setStep({
        origin: RecurringBuyOrigins.BUY_CONFIRMATION, // needed for analytics tracking
        step: RecurringBuyStepType.GET_STARTED
      })
    } else {
      this.props.handleClose()
    }
  }

  render() {
    return this.props.data.cata({
      Failure: () => <DataError />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => {
        const { order } = val
        const { state } = order
        const currencySymbol = getSymbol(getCounterCurrency(order))
        const [recurringBuy] = val.recurringBuyList.filter((rb) => {
          return rb.id === order.recurringBuyId
        })
        const frequencyText =
          recurringBuy && getPeriodForSuccess(recurringBuy.period, recurringBuy.nextPayment)

        if (order.state === 'PENDING_DEPOSIT') {
          if (
            (order.attributes?.cardProvider?.cardAcquirerName === 'EVERYPAY' &&
              order.attributes?.cardProvider?.paymentState === 'WAITING_FOR_3DS_RESPONSE') ||
            order.attributes?.everypay?.paymentState === 'WAITING_FOR_3DS_RESPONSE'
          ) {
            this.props.buySellActions.setStep({
              step: '3DS_HANDLER_EVERYPAY'
            })
          }

          if (
            order.attributes?.cardProvider?.cardAcquirerName === 'STRIPE' &&
            order.attributes?.cardProvider?.paymentState === 'WAITING_FOR_3DS_RESPONSE'
          ) {
            this.props.buySellActions.setStep({
              step: '3DS_HANDLER_STRIPE'
            })
          }

          if (
            order.attributes?.cardProvider?.cardAcquirerName === 'CHECKOUTDOTCOM' &&
            order.attributes?.cardProvider?.paymentState === 'WAITING_FOR_3DS_RESPONSE'
          ) {
            this.props.buySellActions.setStep({
              step: '3DS_HANDLER_CHECKOUTDOTCOM'
            })
          }
        }

        const handleCompleteButton = () => {
          if (
            order.attributes?.cardProvider?.cardAcquirerName === 'EVERYPAY' ||
            order.attributes?.everypay
          ) {
            this.props.buySellActions.setStep({
              step: '3DS_HANDLER_EVERYPAY'
            })
          }

          if (order.attributes?.cardProvider?.cardAcquirerName === 'STRIPE') {
            this.props.buySellActions.setStep({
              step: '3DS_HANDLER_STRIPE'
            })
          }

          if (order.attributes?.cardProvider?.cardAcquirerName === 'CHECKOUTDOTCOM') {
            this.props.buySellActions.setStep({
              step: '3DS_HANDLER_CHECKOUTDOTCOM'
            })
          }
        }

        return state === 'FAILED' || state === 'CANCELED' || !order.paymentType ? (
          <DataError />
        ) : val.userData?.tiers?.current !== 2 ? (
          <SuccessSdd {...val} {...this.props} />
        ) : (
          <OrderSummary
            baseAmount={getBaseAmount(order)}
            baseCurrency={getBaseCurrency(order)}
            counterAmount={getCounterAmount(order)}
            currencySymbol={currencySymbol}
            handleClose={this.props.handleClose}
            handleCompleteButton={handleCompleteButton}
            handleOkButton={this.handleOkButton}
            lockTime={val.lockTime}
            orderState={state}
            orderType={getOrderType(order) as OrderType}
            outputCurrency={order.outputCurrency}
            paymentState={order.attributes?.everypay?.paymentState || null}
            paymentType={order.paymentType}
            frequencyText={frequencyText}
          >
            {val.interestAfterTransaction.show ? (
              <InterestBanner handleClose={this.props.handleClose} />
            ) : null}
          </OrderSummary>
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): LinkStatePropsType => ({
  data: getData(state),
  formValues: selectors.form.getFormValues(FORM_BS_CHECKOUT)(state) as BSCheckoutFormValuesType,
  hasAvailablePeriods: selectors.components.recurringBuy.hasAvailablePeriods(ownProps.method)(
    state
  ),
  hasQuote: selectors.components.buySell.hasQuote(state),
  isGoldVerified: equals(selectors.modules.profile.getCurrentTier(state), 2),
  isRecurringBuy: selectors.core.walletOptions
    .getFeatureFlagRecurringBuys(state)
    .getOrElse(false) as boolean,
  orders: selectors.components.buySell.getBSOrders(state).getOrElse([])
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method?: BSPaymentMethodType
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  formValues: BSCheckoutFormValuesType
  hasAvailablePeriods: boolean
  hasQuote: boolean
  isGoldVerified: boolean
  isRecurringBuy: boolean
  orders: BSOrderType[]
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(OrderSummaryContainer)
