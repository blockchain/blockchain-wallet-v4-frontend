import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import ExchangeHistory from './template.js'

class ExchangeHistoryContainer extends React.Component {
  render () {
    return <ExchangeHistory trades={this.props.exchangeHistory.data} />
  }
}

const mapStateToProps = state => ({
  exchangeHistory: selectors.modules.exchangeHistory.getExchangeHistory(state)(1)
})

export default connect(mapStateToProps)(ExchangeHistoryContainer)
