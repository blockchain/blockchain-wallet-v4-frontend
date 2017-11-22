import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import ExchangeHistory from './template.js'

class ExchangeHistoryContainer extends React.Component {
  render () {
    const { trades } = this.props
    return <ExchangeHistory trades={trades} />
  }
}

const mapStateToProps = state => ({
  trades: selectors.core.kvStore.shapeShift.getTrades(state)
})

export default connect(mapStateToProps)(ExchangeHistoryContainer)
