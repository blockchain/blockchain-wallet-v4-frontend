import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  FiatTypeEnum,
  RemoteDataType,
  SBOrderType,
  SBQuoteType,
  SupportedCoinType,
  SupportedWalletCurrenciesType
} from 'core/types'
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
    this.props.simpleBuyActions.fetchSBQuote()
  }

  handleSubmit = () => {
    const { userData } = this.props.data.getOrElse({
      userData: { tiers: { current: 0 } } as UserDataType
    } as SuccessStateType)

    if (userData.tiers.current < 2) {
      this.props.identityVerificationActions.verifyIdentity(
        2,
        false,
        'SBEnterAmountCheckout'
      )
      return
    }

    if (this.props.order.paymentMethodId) {
      this.props.simpleBuyActions.confirmSBCreditCardOrder(
        this.props.order.paymentMethodId
      )
    } else if (this.props.order.paymentType === 'PAYMENT_CARD') {
      this.props.simpleBuyActions.setStep({
        step: 'ADD_CARD'
      })
    } else {
      this.props.simpleBuyActions.confirmSBBankTransferOrder()
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
export type SuccessStateType = {
  quote: SBQuoteType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  supportedCoins: SupportedWalletCurrenciesType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CheckoutConfirm)
