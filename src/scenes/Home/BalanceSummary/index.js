import React from 'react'
import {connect} from 'react-redux'
import { propEq, filter, map, prop, has } from 'ramda'
import {bindActionCreators} from 'redux'
import { core } from 'data/rootSelectors.js'

import BalanceSummary from './template.js'

class BalanceSummaryContainer extends React.Component {
  render () {
    let balances = [{
      title: 'My Bitcoin Wallet',
      amount: 0.00199132
    }, {
      title: 'beer budget',
      amount: 0
    }, {
      title: 'my single legacy address',
      amount: 0
    }]
    let total = 0.00199132

    return (
      <BalanceSummary balances={balances} total={total} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  const legacyAddresses = core.wallet.getAddresses(state)
  const hdAccounts = core.wallet.getHDAccounts(state)
  const addresses = core.addresses.getBalances(state)
  console.log(core.common.wallet(state))
  // console.log(map(myfun, addresses))
  // let balances = []
  // for(let i =0; i< addresses; i++) {

  // }

  // filter(propEq('address', address), prop('addresses', data))
  // const a = legacyAddresses[0].addr

  // const elementL = filter(propEq('addr', a), legacyAddresses)


  // console.log(elementL)
  // console.log(elementL[0].label)
  // const balances = core.addresses.

  return {
    balances: undefined
  }
}

export default connect(mapStateToProps)(BalanceSummaryContainer)
