import React from 'react'
import { connect } from 'react-redux'
import { assoc, map } from 'ramda'

import { selectors } from 'data'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'

import SelectBoxesAccounts from './template.js'

class SelectBoxesAccountsContainer extends React.Component {
  constructor (props) {
    super(props)
    const { source, target } = this.props.input.value
    this.state = { source, target }

    // this.handleBlur = this.handleBlur.bind(this)
    this.handleSelectSource = this.handleSelectSource.bind(this)
    this.handleSelectTarget = this.handleSelectTarget.bind(this)
    // this.handleFocus = this.handleFocus.bind(this)
  }

  handleSelectSource (value) {
    const {btcAccounts, ethAccount} = this.props
    var newTarget
    if (value.coin === 'ETH') {
      if (!this.state || !this.state.target || this.state.target.coin === 'ETH') {
        newTarget = btcAccounts[0].value
      }
    } else {
      if (!this.state || !this.state.target || this.state.target.coin === 'BTC') {
        newTarget = ethAccount[0].value
      }
    }
    const newState = { source: value, target: newTarget || this.state.target }
    this.setState(newState)
    this.props.input.onChange(newState)
  }

  handleSelectTarget (value) {
    const { btcAccounts, ethAccount } = this.props
    var newSource
    if (value.coin === 'ETH') {
      if (!this.state || !this.state.source || this.state.source.coin === 'ETH') {
        newSource = btcAccounts[0].value
      }
    } else {
      if (!this.state || !this.state.source || this.state.source.coin === 'BTC') {
        newSource = ethAccount[0].value
      }
    }
    const newState = { source: newSource || this.state.source, target: value }
    this.setState(newState)
    this.props.input.onChange(newState)
  }

  // handleBlur () {
  //   if (this.props.input.onBlur) { this.props.input.onBlur(this.state.value) }
  // }

  // handleFocus () {
  //   if (this.props.input.onFocus) { this.props.input.onFocus(this.state.value) }
  // }

  render () {
    const { btcAccounts, ethAccount } = this.props
    const allItems = []
    allItems.push({ group: '', items: btcAccounts })
    allItems.push({ group: '', items: ethAccount })

    return <SelectBoxesAccounts
      items={allItems}
      source={this.state ? this.state.source : false}
      target={this.state ? this.state.target : false}
      handleSelectSource={this.handleSelectSource}
      handleSelectTarget={this.handleSelectTarget}
      /* { value={this.state.value}
      toValue={this.state.toValue}
      handleBlur={this.handleBlur}
      handleFocus={this.handleFocus} */
      {...this.props}
    />
  }
}

const mapStateToProps = (state, ownProps) => {
  const coinDisplayed = selectors.preferences.getCoinDisplayed(state)
  const unit = selectors.core.settings.getBtcUnit(state)
  const currency = selectors.core.settings.getCurrency(state)
  const btcRates = selectors.core.data.bitcoin.getRates(state)
  const ethRates = selectors.core.data.ethereum.getRates(state)

  const transformAddresses = items => map(item => {
    const { title, amount, ...rest } = item
    const display = coinDisplayed
      ? Exchange.displayBitcoinToBitcoin({ value: amount, fromUnit: 'SAT', toUnit: unit })
      : Exchange.displayBitcoinToFiat({ value: amount, fromUnit: 'SAT', toCurrency: currency, rates: btcRates })

    const text = (
      <div>
        <Icon name='bitcoin' />
        {title} ({display})
      </div>
    )

    return { text, value: assoc('coin', 'BTC', rest) }
  }, items)

  const transformEthBalance = balance => {
    const display = coinDisplayed
      ? Exchange.displayEtherToEther({ value: balance, fromUnit: 'WEI', toUnit: 'ETH' })
      : Exchange.displayEtherToFiat({ value: balance, fromUnit: 'WEI', toCurrency: currency, rates: ethRates })

    const text = (
      <div>
        <Icon name='ethereum' />
        <FormattedMessage id='components.form.selectboxesaccounts.etherwallet' defaultMessage='My ether wallet' />
        ({display})
      </div>
    )

    return [{ text, value: {coin: 'ETH'} }]
  }

  const btcAccounts = transformAddresses(selectors.core.common.getAccountsBalances(state))
  const ethAccount = transformEthBalance(selectors.core.data.ethereum.getBalance(state))

  return {
    btcAccounts,
    ethAccount,
    unit,
    currency,
    coinDisplayed
  }
}

export default connect(mapStateToProps)(SelectBoxesAccountsContainer)
