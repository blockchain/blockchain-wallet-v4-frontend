import { any, append, filter, head, keys, toUpper } from 'ramda'
import { connect } from 'react-redux'
import React from 'react'

import { getData } from './selectors'
import Balances from './template'

class BalancesContainer extends React.PureComponent {
  render () {
    const { path, supportedCoins } = this.props
    const coins = append('LOCKBOX', keys(supportedCoins))
    const coinOrRoute = head(
      filter(
        path => any(coin => coin === toUpper(path))(coins),
        path.split('/')
      )
    )
    return (
      <Balances
        coinOrRoute={coinOrRoute || 'TOTAL'}
        supportedCoins={supportedCoins}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(BalancesContainer)
