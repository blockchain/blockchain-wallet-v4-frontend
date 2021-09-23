import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Exchange, Remote } from '@core'
import {
  ExtractSuccess,
  OrderType,
  RemoteDataType,
  SBOrderType,
  SBPaymentMethodType,
  SBPaymentTypes
} from '@core/types'
import DataError from 'components/DataError'
import { getPeriodForSuccess, OrderSummary as Success } from 'components/Flyout'
import { actions, selectors } from 'data'
import {
  getBaseAmount,
  getBaseCurrency,
  getCounterAmount,
  getCounterCurrency,
  getOrderType
} from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import {
  RecurringBuyOrigins,
  RecurringBuyPeriods,
  RecurringBuyStepType,
  SBCheckoutFormValuesType
} from 'data/types'

import Loading from '../template.loading'
// import Success from './template.success'
import InterestBanner from './InterestBanner'
import { getData } from './selectors'
import SuccessSdd from './template.sdd.success'

const { getSymbol } = Exchange
class OrderSummary extends PureComponent<Props> {
  componentDidMount() {
    if (!Remote.Success.is(this.props.data)) {
      this.props.buySellActions.fetchCards(false)
      this.props.sendActions.getLockRule()
      this.props.recurringBuyActions.fetchRegisteredList()
      this.props.recurringBuyActions.fetchPaymentInfo()
    }
    this.props.buySellActions.fetchOrders()

    if (
      this.props.order.state === 'PENDING_DEPOSIT' &&
      this.props.order.attributes?.everypay?.paymentState === 'WAITING_FOR_3DS_RESPONSE'
    ) {
      this.props.buySellActions.setStep({
        order: this.props.order,
        step: '3DS_HANDLER'
      })
    }
    this.props.interestActions.fetchShowInterestCardAfterTransaction({})
  }

  handleRefresh = () => {
    this.props.buySellActions.fetchCards(false)
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

  handleCompleteButton = () => {
    this.props.buySellActions.setStep({
      order: this.props.order,
      step: '3DS_HANDLER'
    })
  }

  render() {
    const { order } = this.props
    const { state } = order
    return this.props.data.cata({
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => {
        const currencySymbol = getSymbol(getCounterCurrency(order))
        const [recurringBuy] = val.recurringBuyList.filter((rb) => {
          return rb.id === order.recurringBuyId
        })
        const frequencyText =
          recurringBuy && getPeriodForSuccess(recurringBuy.period, recurringBuy.nextPayment)

        return state === 'FAILED' || state === 'CANCELED' || !order.paymentType ? (
          <DataError onClick={this.handleRefresh} />
        ) : val.userData?.tiers?.current !== 2 ? (
          <SuccessSdd {...val} {...this.props} />
        ) : (
          <Success
            baseAmount={getBaseAmount(order)}
            baseCurrency={getBaseCurrency(order)}
            counterAmount={`${currencySymbol}${getCounterAmount(order)}`}
            currencySymbol={currencySymbol}
            handleClose={this.props.handleClose}
            handleCompleteButton={this.handleCompleteButton}
            handleOkButton={this.handleOkButton}
            lockTime={val.lockTime}
            orderState={state}
            orderType={getOrderType(order) as OrderType}
            outputCurrency={order.outputCurrency}
            paymentState={order.attributes?.everypay?.paymentState || null}
            paymentType={order.paymentType}
            frequencyText={frequencyText}
          >
            {getOrderType(order) === OrderType.BUY &&
              (order.paymentType === SBPaymentTypes.PAYMENT_CARD ||
                order.paymentType === SBPaymentTypes.USER_CARD ||
                order.paymentType === SBPaymentTypes.BANK_TRANSFER ||
                order.paymentType === SBPaymentTypes.FUNDS)}
            {val.afterTransaction.show && <InterestBanner handleClose={this.props.handleClose} />}
          </Success>
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): LinkStatePropsType => ({
  data: getData(state),
  formValues: selectors.form.getFormValues('simpleBuyCheckout')(state) as SBCheckoutFormValuesType,
  hasAvailablePeriods: selectors.components.recurringBuy.hasAvailablePeriods(ownProps.method)(
    state
  ),
  hasQuote: selectors.components.simpleBuy.hasQuote(state),
  isGoldVerified: equals(selectors.modules.profile.getCurrentTier(state), 2),
  isRecurringBuy: selectors.core.walletOptions
    .getFeatureFlagRecurringBuys(state)
    .getOrElse(false) as boolean,
  orders: selectors.components.simpleBuy.getSBOrders(state).getOrElse([])
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
  method?: SBPaymentMethodType
  order: SBOrderType
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  formValues: SBCheckoutFormValuesType
  hasAvailablePeriods: boolean
  hasQuote: boolean
  isGoldVerified: boolean
  isRecurringBuy: boolean
  orders: SBOrderType[]
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(OrderSummary)
