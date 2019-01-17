import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model } from 'data'
import { getData } from './selectors'
import Actions from './template.js'

class ActionsContainer extends React.PureComponent {
  handleSend = () => {
    const { coin, lockboxPath, lockboxDeviceId } = this.props

    switch (coin) {
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
            lockboxIndex: lockboxPath ? lockboxDeviceId : null
          }
        )
    }
  }

  handleRequest = () => {
    const { coin, lockboxPath, lockboxDeviceId } = this.props

    switch (coin) {
      case 'bch':
        return this.props.modalActions.showModal('RequestBch')
      case 'eth':
        return this.props.modalActions.showModal('RequestEth')
      case 'xlm':
        return this.props.modalActions.showModal('RequestXlm')
      default:
        return this.props.modalActions.showModal('RequestBtc', {
          lockboxIndex: lockboxPath ? lockboxDeviceId : null
        })
    }
  }

  render () {
    const { sendAvailable, requestAvailable } = this.props
    return (
      <Actions
        sendAvailable={sendAvailable}
        requestAvailable={requestAvailable}
        handleSend={this.handleSend}
        handleRequest={this.handleRequest}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  analytics: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(ActionsContainer)
