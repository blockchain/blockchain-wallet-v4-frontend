import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Empty from './template.js'

class EmptyContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSend = this.handleSend.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  handleSend () {
    this.props.paymentBitcoinActions.initSendBitcoin()
  }

  handleRequest () {
    this.props.modalActions.showModal('RequestBitcoin')
  }

  render () {
    return <Empty handleSend={this.handleSend} handleRequest={this.handleRequest} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentBitcoinActions: bindActionCreators(actions.payment.bitcoin, dispatch)
})

export default connect(undefined, mapDispatchToProps)(EmptyContainer)
