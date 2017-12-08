import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import ExchangeHistory from './template.js'

class ExchangeHistoryContainer extends React.Component {
  render () {
    return <ExchangeHistory trades={this.props.exchangeHistory.data.trades} />
  }
}

const mapStateToProps = state => ({
  exchangeHistory: selectors.components.exchangeHistory.getExchangeHistory(state)
})

export default connect(mapStateToProps)(ExchangeHistoryContainer)
