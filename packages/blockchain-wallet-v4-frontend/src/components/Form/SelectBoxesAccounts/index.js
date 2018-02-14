import React from 'react'
import { connect } from 'react-redux'
import { assoc, concat, compose, equals, filter, groupBy, head, map, mapObjIndexed, path, prop, values } from 'ramda'

import { selectors } from 'data'
import { getData } from './selectors'
import Success from './template.js'

class SelectBoxesAccountsContainer extends React.Component {
  constructor (props) {
    super(props)
    const { accounts, input } = props
    const { source, target } = input.value
    const sourceCoin = prop('coin', source) || 'BTC'
    const targetCoin = prop('coin', target) || 'ETH'

    // this.state = {
    //   source,
    //   target,
    //   sourceItems: generateAccounts(accounts, sourceCoin),
    //   targetItems: generateAccounts(accounts, targetCoin)
    // }

    this.handleChangeSource = this.handleChangeSource.bind(this)
    this.handleChangeTarget = this.handleChangeTarget.bind(this)
    this.handleSwap = this.handleSwap.bind(this)
  }

  // handleSelectSource (value) {
  //   const { accounts } = this.props
  //   const target = filterFirstAccount(accounts, value)
  //   const newState = { source: value, target }
  //   this.setState(newState)
  //   this.props.input.onChange(newState)
  // }

  // handleSelectTarget (value) {
  //   const { accounts } = this.props
  //   const source = filterFirstAccount(accounts, value)
  //   const newState = { source, target: value }
  //   this.setState(newState)
  //   this.props.input.onChange(newState)
  // }

  handleChangeSource (value) {
    console.log('handleChangeSource')
  }

  handleChangeTarget (value) {
    console.log('handleChangeTarget')
  }

  handleSwap () {
    const newState = { source: this.state.target, target: this.state.source }
    this.setState(newState)
    this.props.input.onChange(newState)
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success
        source={value.sourceDefault}
        target={value.targetDefault}
        elements={value.elements}
        handleChangeSource={this.handleChangeSource}
        handleChangeTarget={this.handleChangeTarget}
        handleSwap={this.handleSwap}
      />,
      Failure: (message) => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

// const transformBitcoin = (data) => ({
//   text: <Icon name='bitcoin' size='14px' weight={300} cursor>{prop('title', data)}</Icon>,
//   value: data
// })

// const tranformEthereum = (data) => ({
//   text: <Icon name='ethereum' size='14px' weight={300} cursor>{prop('label', data)}</Icon>,
//   value: data
// })

// const transformDisplay = (data) => {
//   switch (data.coin) {
//     case 'BTC': return transformBitcoin(data)
//     case 'ETH': return tranformEthereum(data)
//   }
// }

// const generateAccounts = (accounts, coinToExclude) => {
//   const transform = compose(
//     values,
//     mapObjIndexed((num, key, obj) => ({ group: key, items: num })),
//     groupBy(a => path(['value', 'coin'], a)),
//     map(a => transformDisplay(a))
//   )

//   return transform(accounts)
// }

// const filterFirstAccount = (accounts, value) => {
//   return head(filter(a => !equals(prop('coin', a), prop('coin', value)), accounts))
// }

const mapStateToProps = (state, ownProps) => {
  // const bitcoinHdAccounts = selectors.core.common.bitcoin.getAccountsBalances(state)
  // const bitcoinLegacyAddresses = selectors.core.common.bitcoin.getAddressesBalances(state)
  // const bitcoinAccounts = map(a => assoc('coin', 'BTC', a), concat(bitcoinHdAccounts, bitcoinLegacyAddresses))
  // const ethereumAccounts = selectors.core.common.ethereum.getAccountBalances(state)

  // return {
  //   coinDisplayed: selectors.preferences.getCoinDisplayed(state),
  //   unit: selectors.core.settings.getBtcUnit(state),
  //   currency: selectors.core.settings.getCurrency(state),
  //   accounts: concat(bitcoinAccounts, ethereumAccounts)
  // }
  return {
    data: getData(state)
  }
}

export default connect(mapStateToProps)(SelectBoxesAccountsContainer)
