import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { actions, selectors } from '../../data'
import { Exchange } from 'blockchain-wallet-v4/src'

class CoinDisplay extends Component {

  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    const { value, bitcoinRates } = this.props
    const balanceInBTC = Exchange.convertBitcoinToBitcoin({ value: value, fromUnit: 'SAT', toUnit: 'BTC' })
    const balanceInFiat = Exchange.convertBitcoinToFiat({ value: value, fromUnit: 'SAT', toCurrency: 'USD', rates: bitcoinRates })
    return (
      <View>
        {/* <Text>{balanceInBTC.value} {balanceInBTC.unit.currency}</Text> */}
        <Text>{balanceInFiat.value} {balanceInFiat.unit.currency}</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  bitcoinRates: selectors.core.data.bitcoin.getRates(state),
})

export default connect(mapStateToProps)(CoinDisplay)
