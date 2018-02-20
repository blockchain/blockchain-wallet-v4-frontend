import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Actions from './template.js'

class ActionsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSend = this.handleSend.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  handleSend () {
    const { pathname } = this.props.router.location

    switch (pathname) {
      case '/eth/transactions': return this.props.modalActions.showModal('SendEth')
      case '/bch/transactions': return this.props.modalActions.showModal('SendBch')
      default: return this.props.modalActions.showModal('SendBtc')
    }
  }

  handleRequest () {
    const { pathname } = this.props.router.location
    switch (pathname) {
      case '/bch/transactions': return this.props.modalActions.showModal('RequestBch')
      case '/eth/transactions': return this.props.modalActions.showModal('RequestEther')
      default: return this.props.modalActions.showModal('RequestBtc')
    }
  }

  render () {
    return <Actions handleSend={this.handleSend} handleRequest={this.handleRequest} />
  }
}

const mapStateToProps = (state) => ({
  router: state.router
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer)
