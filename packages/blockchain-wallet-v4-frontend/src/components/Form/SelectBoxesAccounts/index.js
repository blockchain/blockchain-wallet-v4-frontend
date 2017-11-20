import React from 'react'
import { connect } from 'react-redux'
import { assoc, assocPath, concat, map } from 'ramda'
import { selectors } from 'data'
import { Icon } from 'blockchain-info-components'

import SelectBoxesAccounts from './template.js'

class SelectBoxesAccountsContainer extends React.Component {
  constructor (props) {
    super(props)
    const { source, target } = this.props.input.value
    const { btcAccounts, ethAccounts } = this.props

    this.state = {
      source: source || btcAccounts[0].value,
      target: target || ethAccounts[0].value,
      allItems: [
        { group: '', items: btcAccounts },
        { group: '', items: ethAccounts }
      ]
    }

    this.handleSelectSource = this.handleSelectSource.bind(this)
    this.handleSelectTarget = this.handleSelectTarget.bind(this)
    this.handleSwap = this.handleSwap.bind(this)
  }

  handleSelectSource (value) {
    const {btcAccounts, ethAccounts} = this.props
    var newTarget
    if (value.coin === 'ETH') {
      if (this.state.target.coin === 'ETH') {
        newTarget = btcAccounts[0].value
      }
    } else {
      if (this.state.target.coin === 'BTC') {
        newTarget = ethAccounts[0].value
      }
    }
    this.setState({ source: value, target: newTarget || this.state.target })
    this.props.input.onChange(this.state)
  }

  handleSelectTarget (value) {
    const { btcAccounts, ethAccounts } = this.props
    var newSource
    if (value.coin === 'ETH') {
      if (this.state.source.coin === 'ETH') {
        newSource = btcAccounts[0].value
      }
    } else {
      if (this.state.source.coin === 'BTC') {
        newSource = ethAccounts[0].value
      }
    }
    this.setState({ source: newSource || this.state.source, target: value })
    this.props.input.onChange(this.state)
  }

  handleSwap () {
    this.setState({ source: this.state.target, target: this.state.source })
    this.props.input.onChange(this.state)
  }

  render () {
    return (
      <SelectBoxesAccounts
        items={this.state.allItems}
        source={this.state.source}
        target={this.state.target}
        handleSelectSource={this.handleSelectSource}
        handleSelectTarget={this.handleSelectTarget}
        handleSwap={this.handleSwap}
        {...this.props}
      />
    )
  }
}

const transformBitcoinAddress = (address) => {
  const { title, ...rest } = address
  return {
    text: <Icon name='bitcoin' size='14px' weight={300}>{title}</Icon>,
    value: assoc('coin', 'BTC', rest)
  }
}

const tranformEthereumAddress = (address, ethBalance) => {
  return {
    text: (
      <Icon name='ethereum' size='14px' weight={300}>
        {address.label}
      </Icon>
    ),
    value: { coin: 'ETH', address: address.addr, amount: ethBalance }
  }
}

const mapStateToProps = (state, ownProps) => {
  const coinDisplayed = selectors.preferences.getCoinDisplayed(state)
  const unit = selectors.core.settings.getBtcUnit(state)
  const currency = selectors.core.settings.getCurrency(state)
  const btcHDAddresses = map(x => transformBitcoinAddress(x), selectors.core.common.getAccountsBalances(state))
  const btcLegacyAddresses = map(x => transformBitcoinAddress(x), selectors.core.common.getAddressesBalances(state))
  const ethAccounts = map(x => tranformEthereumAddress(x), selectors.core.kvStore.ethereum.getAccounts(state))
  const ethBalance = selectors.core.data.ethereum.getBalance(state)

  return {
    btcAccounts: concat(btcHDAddresses, btcLegacyAddresses),
    ethAccounts: map(x => assocPath(['value', 'amount'], ethBalance, x), ethAccounts),
    unit,
    currency,
    coinDisplayed
  }
}

export default connect(mapStateToProps)(SelectBoxesAccountsContainer)
