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
    this.props.sendBitcoinActions.initSendBitcoin()
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
  sendBitcoinActions: bindActionCreators(actions.modules.sendBitcoin, dispatch)
})

export default connect(undefined, mapDispatchToProps)(EmptyContainer)
