import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { defaultTo, filter, prop } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import {
  BSOrderType,
  BSPaymentTypes,
  ExtractSuccess,
  MobilePaymentType,
  WalletFiatType
} from '@core/types'
import DataError from 'components/DataError'
import { actions, model, selectors } from 'data'
import { getFiatFromPair, getOrderType } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import {
  AddBankStepType,
  BankPartners,
  BankTransferAccountType,
  BrokerageModalOriginType,
  BSCheckoutFormValuesType,
  UserDataType
} from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const { FORM_BS_CHECKOUT } = model.components.buySell

class CheckoutConfirm extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.isFlexiblePricingModel) {
      this.props.buySellActions.fetchBuyQuote({
        amount: this.props.order.inputQuantity,
        pair: this.props.order.pair,
        paymentMethod:
          this.props.order.paymentType === undefined
            ? BSPaymentTypes.FUNDS
            : this.props.order.paymentType,
        paymentMethodId: this.props.order.paymentMethodId
      })
    } else {
      this.props.buySellActions.fetchQuote({
        amount: this.props.order.inputQuantity,
        orderType: getOrderType(this.props.order),
        pair: this.props.order.pair
      })
    }
    this.props.sendActions.getLockRule()
    if (!Remote.Success.is(this.props.data)) {
      this.props.buySellActions.fetchSDDEligibility()
      this.props.buySellActions.fetchSDDVerified()
      this.props.buySellActions.fetchCards(false)
      this.props.brokerageActions.fetchBankTransferAccounts()
    }
  }

  handleSubmit = () => {
    const { bankAccounts, cards, isSddFlow, isUserSddVerified, sbBalances, userData } =
      this.props.data.getOrElse({
        isSddFlow: false,
        userData: { tiers: { current: 0 } } as UserDataType
      } as SuccessStateType)

    const userTier = userData?.tiers?.current
    const inputCurrency = this.props.order.inputCurrency as WalletFiatType
    // check for SDD flow and direct to add card
    if (isSddFlow && this.props.order.paymentType === BSPaymentTypes.PAYMENT_CARD) {
      if (isUserSddVerified) {
        if (cards && cards.length > 0) {
          const card = cards[0]
          return this.props.buySellActions.confirmOrder({
            order: this.props.order,
            paymentMethodId: card.id
          })
        }
        return this.props.buySellActions.setStep({
          step: 'DETERMINE_CARD_PROVIDER'
        })
      }
      return this.props.buySellActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }

    if (userTier < 2) {
      return this.props.buySellActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }

    switch (this.props.order.paymentType) {
      case BSPaymentTypes.FUNDS:
        const available = sbBalances[inputCurrency]?.available || '0'
        if (new BigNumber(available).isGreaterThanOrEqualTo(this.props.order.inputQuantity)) {
          return this.props.buySellActions.confirmFundsOrder()
        }
        return this.props.buySellActions.setStep({
          displayBack: false,
          fiatCurrency: inputCurrency,
          step: 'BANK_WIRE_DETAILS'
        })

      case BSPaymentTypes.PAYMENT_CARD:
        let { paymentMethodId } = this.props.order

        if (
          this.props.mobilePaymentMethod === MobilePaymentType.APPLE_PAY &&
          this.props.applePayInfo
        ) {
          paymentMethodId = this.props.applePayInfo.beneficiaryID
        }

        if (paymentMethodId) {
          return this.props.buySellActions.confirmOrder({
            mobilePaymentMethod: this.props.mobilePaymentMethod,
            order: this.props.order,
            paymentMethodId
          })
        }

        // return this.props.buySellActions.setStep({ step: 'DETERMINE_CARD_PROVIDER' })

        break

      case BSPaymentTypes.BANK_TRANSFER:
        const [bankAccount] = filter(
          (b: BankTransferAccountType) =>
            b.state === 'ACTIVE' && b.id === this.props.order.paymentMethodId,
          defaultTo([])(bankAccounts)
        )
        const paymentPartner = prop('partner', bankAccount)
        // if yapily we need the auth screen before creating the order
        if (paymentPartner === BankPartners.YAPILY) {
          return this.props.buySellActions.setStep({
            order: this.props.order,
            step: 'AUTHORIZE_PAYMENT'
          })
        }
        if (this.props.order.paymentMethodId) {
          return this.props.buySellActions.confirmOrder({
            order: this.props.order,
            paymentMethodId: this.props.order.paymentMethodId
          })
        }
        this.props.brokerageActions.showModal({
          modalType: 'ADD_BANK_YODLEE_MODAL',
          origin: BrokerageModalOriginType.ADD_BANK_BUY
        })
        return this.props.brokerageActions.setAddBankStep({
          addBankStep: AddBankStepType.ADD_BANK_HANDLER
        })

      default:
        // Not a valid payment method type, go back to CRYPTO_SELECTION
        return this.props.buySellActions.setStep({
          fiatCurrency: getFiatFromPair(this.props.order.pair),
          step: 'CRYPTO_SELECTION'
        })
    }
  }

  render() {
    return this.props.data.cata({
      Failure: (e) => <DataError message={{ message: e }} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  applePayInfo: selectors.components.buySell.getApplePayInfo(state),
  data: getData(state),
  formValues: selectors.form.getFormValues(FORM_BS_CHECKOUT)(state) as BSCheckoutFormValuesType,
  isFlexiblePricingModel: selectors.core.walletOptions
    .getFlexiblePricingModel(state)
    .getOrElse(false),
  mobilePaymentMethod: selectors.components.buySell.getBSMobilePaymentMethod(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
  order: BSOrderType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CheckoutConfirm)
