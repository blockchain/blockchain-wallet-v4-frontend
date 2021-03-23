import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import {
  ExtractSuccess,
  SBOrderType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { getFiatFromPair, getOrderType } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import {
  AddBankStepType,
  BrokerageModalOriginType,
  UserDataType
} from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

class CheckoutConfirm extends PureComponent<Props> {
  state = {}

  componentDidMount() {
    this.props.simpleBuyActions.fetchSBQuote(
      this.props.order.pair,
      getOrderType(this.props.order),
      this.props.order.inputQuantity
    )
    this.props.sendActions.getLockRule()
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSDDEligible()
      this.props.simpleBuyActions.fetchSDDVerified()
      this.props.simpleBuyActions.fetchSBCards()
      this.props.brokerageActions.fetchBankTransferAccounts()
    }
  }

  handleSubmit = () => {
    const {
      cards,
      isSddFlow,
      isUserSddVerified,
      sbBalances,
      userData
    } = this.props.data.getOrElse({
      userData: { tiers: { current: 0 } } as UserDataType,
      isSddFlow: false
    } as SuccessStateType)

    const userTier = userData?.tiers?.current
    const inputCurrency = this.props.order.inputCurrency as WalletFiatType

    // check for SDD flow and direct to add card
    if (isSddFlow && this.props.order.paymentType === 'PAYMENT_CARD') {
      if (isUserSddVerified) {
        if (cards && cards.length > 0) {
          const card = cards[0]
          return this.props.simpleBuyActions.confirmSBCreditCardOrder(
            card.id,
            this.props.order
          )
        }
        return this.props.simpleBuyActions.setStep({
          step: 'ADD_CARD'
        })
      }
      return this.props.simpleBuyActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }

    if (userTier < 2) {
      return this.props.simpleBuyActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }

    switch (this.props.order.paymentType) {
      case 'FUNDS':
        const available = sbBalances[inputCurrency]?.available || '0'
        if (
          new BigNumber(available).isGreaterThanOrEqualTo(
            this.props.order.inputQuantity
          )
        ) {
          return this.props.simpleBuyActions.confirmSBFundsOrder()
        } else {
          return this.props.simpleBuyActions.setStep({
            step: 'BANK_WIRE_DETAILS',
            fiatCurrency: inputCurrency,
            displayBack: false
          })
        }
      case 'PAYMENT_CARD':
        if (this.props.order.paymentMethodId) {
          return this.props.simpleBuyActions.confirmSBCreditCardOrder(
            this.props.order.paymentMethodId,
            this.props.order
          )
        } else {
          return this.props.simpleBuyActions.setStep({ step: 'ADD_CARD' })
        }
      case 'BANK_TRANSFER':
        if (this.props.order.paymentMethodId) {
          return this.props.simpleBuyActions.confirmSBCreditCardOrder(
            this.props.order.paymentMethodId,
            this.props.order
          )
        } else {
          this.props.brokerageActions.showModal(
            BrokerageModalOriginType.ADD_BANK,
            'ADD_BANK_MODAL'
          )
          return this.props.brokerageActions.setAddBankStep({
            addBankStep: AddBankStepType.ADD_BANK_HANDLER
          })
        }
      default:
        // Not a valid payment method type, go back to CRYPTO_SELECTION
        return this.props.simpleBuyActions.setStep({
          step: 'CRYPTO_SELECTION',
          fiatCurrency: getFiatFromPair(this.props.order.pair)
        })
    }
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
      ),
      Failure: e => <DataError message={{ message: e }} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail('Failed to load coin models')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CheckoutConfirm)
