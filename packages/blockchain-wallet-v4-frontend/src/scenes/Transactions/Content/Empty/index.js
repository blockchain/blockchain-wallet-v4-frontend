import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { actions } from 'data'
import Empty from './template.js'

class EmptyContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSend = this.handleSend.bind(this)
    this.handleRequest = this.handleRequest.bind(this)
  }

  handleSend () {
    switch (this.props.coin) {
      case 'BTC':
        this.props.modalActions.showModal('SendBitcoin')
        break
      case 'BCH':
        this.props.modalActions.showModal('SendBch')
        break
      case 'ETH':
        // TODO
        break
      default:
        break
    }
  }

  handleRequest () {
    switch (this.props.coin) {
      case 'BTC':
        this.props.modalActions.showModal('RequestBitcoin')
        break
      case 'BCH':
        this.props.modalActions.showModal('RequestBch')
        break
      case 'ETH':
        // TODO
        break
      default:
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
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH'])
}

export default connect(
  undefined,
  mapDispatchToProps
)(EmptyContainer)
