import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { model, actions } from 'data'
import Empty from './template.js'

class EmptyContainer extends React.PureComponent {
  handleSend = () => {
    switch (this.props.coin) {
      case 'BCH':
        this.props.modalActions.showModal(model.components.sendBch.MODAL)
        break
      case 'ETH':
        this.props.modalActions.showModal(model.components.sendEth.MODAL)
        break
      case 'XLM':
        this.props.modalActions.showModal(model.components.sendXlm.MODAL)
        break
      default:
        this.props.modalActions.showModal(model.components.sendBtc.MODAL)
        break
    }
  }

  handleRequest = () => {
    switch (this.props.coin) {
      case 'BCH':
        this.props.modalActions.showModal('RequestBch')
        break
      case 'ETH':
        this.props.modalActions.showModal('RequestEth')
        break
      case 'XLM':
        this.props.modalActions.showModal('RequestXlm')
        break
      default:
        this.props.modalActions.showModal('RequestBtc')
        break
    }
  }

  render () {
    return (
      <Empty
        handleSend={this.handleSend}
        handleRequest={this.handleRequest}
        coin={this.props.coin}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

EmptyContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH']).isRequired
}

export default connect(
  undefined,
  mapDispatchToProps
)(EmptyContainer)
