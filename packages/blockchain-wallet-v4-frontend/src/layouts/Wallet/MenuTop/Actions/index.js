import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import Actions from './template.js'

class ActionsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSend = this.handleSend.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  handleSend () {
    this.props.analytics.logClick('send')
    const { pathname } = this.props.router.location

    const paths = pathname.split('/')

    switch (paths[1]) {
      case 'eth':
        return this.props.modalActions.showModal(model.components.sendEth.MODAL)
      case 'bch':
        return this.props.modalActions.showModal(model.components.sendBch.MODAL)
      case 'xlm':
        return this.props.modalActions.showModal(model.components.sendXlm.MODAL)
      default:
        return this.props.modalActions.showModal(
          model.components.sendBtc.MODAL,
          {
            lockboxIndex: pathname.includes('lockbox') ? paths[3] : null
          }
        )
    }
  }

  handleRequest () {
    this.props.analytics.logClick('request')
    const { pathname } = this.props.router.location

    const paths = pathname.split('/')

    switch (paths[1]) {
      case 'bch':
        return this.props.modalActions.showModal('RequestBch')
      case 'eth':
        return this.props.modalActions.showModal('RequestEth')
      case 'xlm':
        return this.props.modalActions.showModal('RequestXlm')
      default:
        return this.props.modalActions.showModal('RequestBtc', {
          lockboxIndex: pathname.includes('lockbox') ? paths[3] : null
        })
    }
  }

  render () {
    return (
      <Actions
        handleSend={this.handleSend}
        handleRequest={this.handleRequest}
      />
    )
  }
}

const mapStateToProps = state => ({
  router: state.router
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  analytics: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsContainer)
