import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  ExtractSuccess,
  FiatTypeEnum,
  RemoteDataType,
  SBOrderType,
  SupportedCoinType,
  SupportedWalletCurrenciesType
} from 'core/types'
import { getData } from './selectors'
import { Remote } from 'core'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from '../AddCard/template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'
import SuccessSdd from './template.sdd.success'

class OrderSummary extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBCards()
      this.props.sendActions.getLockRule('PAYMENT_CARD')
    }
    this.props.simpleBuyActions.fetchSBOrders()
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCards()
  }

  render () {
    const { isFirstLogin } = this.props
    return this.props.data.cata({
      Success: val => {
        if (isFirstLogin) {
          return <SuccessSdd {...val} {...this.props} />
        }
        return <Success {...val} {...this.props} />
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
    .getOrElse({
      ALGO: { colorCode: 'algo' } as SupportedCoinType,
      BTC: { colorCode: 'btc' } as SupportedCoinType,
      BCH: { colorCode: 'bch' } as SupportedCoinType,
      ETH: { colorCode: 'eth' } as SupportedCoinType,
      PAX: { colorCode: 'pax' } as SupportedCoinType,
      USDT: { colorCode: 'usdt' } as SupportedCoinType,
      WDGLD: { colorCode: 'wdgld' } as SupportedCoinType,
      XLM: { colorCode: 'xlm' } as SupportedCoinType
    } as Omit<SupportedWalletCurrenciesType, keyof FiatTypeEnum>),
  isFirstLogin: selectors.auth.getFirstLogin(state)
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
  isFirstLogin: boolean
  supportedCoins: SupportedWalletCurrenciesType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(OrderSummary)
