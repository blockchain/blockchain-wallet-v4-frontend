import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import {
  ExtractSuccess,
  FiatTypeEnum,
  SBOrderType,
  SupportedCoinType,
  SupportedWalletCurrenciesType,
  WalletFiatType
} from 'core/types'
import { getFiatFromPair, getOrderType } from 'data/components/simpleBuy/model'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from '../template.loading'
import Success from './template.success'

class CheckoutConfirm extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.simpleBuyActions.fetchSBQuote(
      this.props.order.pair,
      getOrderType(this.props.order),
      this.props.order.inputQuantity
    )
    this.props.sendActions.getLockRule('PAYMENT_CARD')
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSDDEligible()
      this.props.simpleBuyActions.fetchSDDVerified()
      this.props.simpleBuyActions.fetchSBCards()
    }
  }

  handleSubmit = () => {
    const {
      userData,
      sbBalances,
      isSddFlow,
      isUserSddVerified,
      cards
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
          return this.props.simpleBuyActions.setStep({
            step: '3DS_HANDLER'
          })
        }
        return this.props.simpleBuyActions.setStep({
          step: 'ADD_CARD'
        })
      } else {
        return this.props.simpleBuyActions.setStep({
          step: 'KYC_REQUIRED'
        })
      }
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
            step: 'TRANSFER_DETAILS',
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
      default:
        // Not a valid payment method type, go back to CRYPTO_SELECTION
        return this.props.simpleBuyActions.setStep({
          step: 'CRYPTO_SELECTION',
          fiatCurrency: getFiatFromPair(this.props.order.pair)
        })
    }
  }

  render () {
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
    .getOrElse({
      ALGO: { colorCode: 'algo' } as SupportedCoinType,
      BTC: { colorCode: 'btc' } as SupportedCoinType,
      BCH: { colorCode: 'bch' } as SupportedCoinType,
      ETH: { colorCode: 'eth' } as SupportedCoinType,
      PAX: { colorCode: 'pax' } as SupportedCoinType,
      USDT: { colorCode: 'usdt' } as SupportedCoinType,
      WDGLD: { colorCode: 'wdgld' } as SupportedCoinType,
      XLM: { colorCode: 'xlm' } as SupportedCoinType
    } as Omit<SupportedWalletCurrenciesType, keyof FiatTypeEnum>)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
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
