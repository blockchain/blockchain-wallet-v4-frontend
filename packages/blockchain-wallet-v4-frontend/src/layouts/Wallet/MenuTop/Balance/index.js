import React from 'react'
import { connect } from 'react-redux'
import { any, append, filter, head, keys, toUpper } from 'ramda'

import { model } from 'data'
import { getData } from './selectors'
import Template from './template'
const { COIN_MODELS } = model.coins

class Balance extends React.PureComponent {
  render () {
    const { path } = this.props
    const coins = append('LOCKBOX', keys(COIN_MODELS))
    const coinOrRoute = head(
      filter(
        path => any(coin => coin === toUpper(path))(coins),
        path.split('/')
      )
    )
    return <Template coinOrRoute={coinOrRoute || 'TOTAL'} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Balance)
