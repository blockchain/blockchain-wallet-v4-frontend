import React from 'react'
import { connect } from 'react-redux'
import { assoc, concat, compose, equals, filter, groupBy, head, map, mapObjIndexed, path, prop, values } from 'ramda'
import { selectors } from 'data'
import { Icon } from 'blockchain-info-components'

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

    // this.handleSelectSource = this.handleSelectSource.bind(this)
    // this.handleSelectTarget = this.handleSelectTarget.bind(this)
    // this.handleSwap = this.handleSwap.bind(this)
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

  // handleSwap () {
  //   const newState = { source: this.state.target, target: this.state.source }
  //   this.setState(newState)
  //   this.props.input.onChange(newState)
  // }

  render () {
    // const { source, target, sourceItems, targetItems } = this.state
    const { data } = this.props

    return data.cata({
      Success: (value) => {
        const elements = [{
          group: 'Bitcoin',
          items: value.bitcoin
        }, {
          group: 'Ethereum',
          items: value.ethereum
        }]
        return <Success
          source={value.bitcoinDefault}
          sourceElements={elements}
          target={value.ethereumDefault}
          targetElements={elements} />
      },
      Failure: (message) => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
    // <SelectBoxesAccounts
    //   source={source}
    //   target={target}
    //   sourceItems={sourceItems}
    //   targetItems={targetItems}
    //   handleSelectSource={this.handleSelectSource}
    //   handleSelectTarget={this.handleSelectTarget}
    //   handleSwap={this.handleSwap}
    //   {...this.props}
    // />
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
