import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import {
  RemoteDataType,
  SBOrderType,
  SBQuoteType,
  SupportedCoinsType
} from 'core/types'
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
      userData: { tiers: { current: 0 } }
    })

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
      BTC: { colorCode: 'btc' },
      BCH: { colorCode: 'bch' },
      ETH: { colorCode: 'eth' },
      PAX: { colorCode: 'pax' },
      STX: { colorCode: 'stx' },
      XLM: { colorCode: 'xlm' }
    })
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
  supportedCoins: SupportedCoinsType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CheckoutConfirm)
