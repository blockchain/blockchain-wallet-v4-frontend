import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  FiatTypeEnum,
  RemoteDataType,
  SBCardType,
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

class OrderSummary extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBCards()
    }
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCards()
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
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
      XLM: { colorCode: 'xlm' } as SupportedCoinType
    } as Omit<SupportedWalletCurrenciesType, keyof FiatTypeEnum>)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
export type SuccessStateType = {
  cards: Array<SBCardType>
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  supportedCoins: SupportedWalletCurrenciesType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(OrderSummary)
