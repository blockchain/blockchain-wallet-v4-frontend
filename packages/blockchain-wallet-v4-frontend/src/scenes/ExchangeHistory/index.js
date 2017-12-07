import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import ExchangeHistory from './template.js'

class ExchangeHistoryContainer extends React.Component {
  render () {
    return <ExchangeHistory trades={this.props.trades} />
  }
}

const mapStateToProps = state => ({
  trades: selectors.core.kvStore.shapeShift.getTrades(state)
})

const mapDispatchToProps = dispatch => ({
  dataActions: bindActionCreators(actions.data, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeHistoryContainer)
