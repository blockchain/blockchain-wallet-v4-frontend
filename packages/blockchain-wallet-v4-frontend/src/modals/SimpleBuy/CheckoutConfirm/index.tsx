import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'

import {
  ExtractSuccess,
  FiatTypeEnum,
  RemoteDataType,
  SBOrderType,
  SupportedCoinType,
  SupportedWalletCurrenciesType,
  WalletFiatType
} from 'core/types'
import {
  getCoinFromPair,
  getFiatFromPair,
  getOrderType
} from 'data/components/simpleBuy/model'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class CheckoutConfirm extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.simpleBuyActions.fetchSBQuote(getOrderType(this.props.order))
  }

  handleSubmit = () => {
    const { userData, sbBalances } = this.props.data.getOrElse({
      userData: { tiers: { current: 0 } } as UserDataType
    } as SuccessStateType)

    const inputCurrency = this.props.order.inputCurrency as WalletFiatType

    if (userData.tiers.current < 2) {
      this.props.simpleBuyActions.setStep({
        step: 'KYC_REQUIRED'
      })
      return
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
            this.props.order.paymentMethodId
          )
        } else {
          return this.props.simpleBuyActions.setStep({ step: 'ADD_CARD' })
        }
      default:
        // Not a valid payment method type, go back to ENTER_AMOUNT
        return this.props.simpleBuyActions.setStep({
          step: 'ENTER_AMOUNT',
          cryptoCurrency: getCoinFromPair(this.props.order.pair),
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

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
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
      XLM: { colorCode: 'xlm' } as SupportedCoinType
    } as Omit<SupportedWalletCurrenciesType, keyof FiatTypeEnum>)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  supportedCoins: SupportedWalletCurrenciesType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CheckoutConfirm)
