import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import {
  FiatTypeEnum,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

import CoinDisplay from '../CoinDisplay'
import FiatDisplay from '../FiatDisplay'

class SwitchableDisplayContainer extends React.PureComponent<Props> {
  render() {
    return !this.props.coinDisplayed || this.props.coin in FiatTypeEnum ? (
      <FiatDisplay {...this.props}>{this.props.children}</FiatDisplay>
    ) : (
      <CoinDisplay {...this.props}>{this.props.children}</CoinDisplay>
    )
  }
}

type OwnProps = {
  children: string | number
  coin: WalletCurrencyType
  hideCoinTicker?: boolean
  size?: string
  weight?: number
}

const mapStateToProps = state => ({
  coinDisplayed: selectors.preferences.getCoinDisplayed(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(SwitchableDisplayContainer)
