import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import ExchangeConfirm from './template'

class ExchangeConfirmContainer extends React.Component {
  render () {
    return <ExchangeConfirm {...this.props} />
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeConfirmContainer)
