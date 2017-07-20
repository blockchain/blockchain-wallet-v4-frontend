import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import AutoDisconnection from './AutoDisconnection'
import QRCode from './QRCode'
import QRCodeCapture from './QRCodeCapture'
import RequestBitcoin from './RequestBitcoin'
import SendBitcoin from './SendBitcoin'

class Modals extends React.Component {
  render () {
    const { type, ...rest } = this.props
    switch (type) {
      case 'AutoDisconnection':
        return <AutoDisconnection {...rest} />
      case 'QRCode':
        return <QRCode {...rest} />
      case 'QRCodeCapture':
        return <QRCodeCapture {...rest} />
      case 'RequestBitcoin':
        return <RequestBitcoin {...rest} />
      case 'SendBitcoin':
        return <SendBitcoin {...rest} />
      default:
        return <div />
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
