import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Remote } from 'blockchain-wallet-v4/src'
import {
  ExtractSuccess,
  RemoteDataType,
  SBOrderType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { bindActionCreators, Dispatch } from 'redux'

import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import Loading from '../template.loading'
import { getData } from './selectors'
import SuccessSdd from './template.sdd.success'
import Success from './template.success'

class OrderSummary extends PureComponent<Props> {
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBCards()
      this.props.sendActions.getLockRule()
    }
    this.props.simpleBuyActions.fetchSBOrders()

    if (
      this.props.order.state === 'PENDING_DEPOSIT' &&
      this.props.order.attributes?.everypay?.paymentState ===
        'WAITING_FOR_3DS_RESPONSE'
    ) {
      this.props.simpleBuyActions.setStep({
        step: '3DS_HANDLER',
        order: this.props.order
      })
    }
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCards()
  }

  render () {
    return this.props.data.cata({
      Success: val => {
        return val.userData?.tiers?.current !== 2 ? (
          <SuccessSdd {...val} {...this.props} />
        ) : (
          <Success {...val} {...this.props} />
        )
      },
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail('Supported coins missing')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  supportedCoins: SupportedWalletCurrenciesType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(OrderSummary)
