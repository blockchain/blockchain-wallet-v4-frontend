import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import QRCode from './QRCode'
import RequestBitcoin from './RequestBitcoin'
import SendBitcoin from './SendBitcoin'

class Modals extends React.Component {
  render () {
    const { type, ...rest } = this.props

    switch (type) {
      case 'RequestBitcoin':
        return <RequestBitcoin {...rest} />
      case 'QRCode':
        return <QRCode {...rest} />
      default:
        return <RequestBitcoin {...rest} />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    payload: selectors.modals.getPayload(state),
    show: selectors.modals.getShow(state),
    type: selectors.modals.getType(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Modals)
