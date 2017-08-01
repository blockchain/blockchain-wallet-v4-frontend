import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { assoc, compose, equals } from 'ramda'

import { actions, selectors } from 'data'
import AutoDisconnection from './AutoDisconnection'
import QRCode from './QRCode'
import QRCodeCapture from './QRCodeCapture'
import RequestBitcoin from './RequestBitcoin'
import SecondPassword from './SecondPassword'
import SendBitcoin from './SendBitcoin'

class Modals extends React.Component {
  constructor (props) {
    super(props)
    this.renderModal = this.renderModal.bind(this)
  }

  renderModal (modal, index) {
    const { lastModalIndex } = this.props
    const props = compose(assoc('displayed', equals(index, lastModalIndex)), assoc('position', index), assoc('key', index))(modal)

    switch (modal.type) {
      case 'AutoDisconnection': return <AutoDisconnection {...props} />
      case 'QRCode': return <QRCode {...props} />
      case 'QRCodeCapture': return <QRCodeCapture {...props} />
      case 'RequestBitcoin': return <RequestBitcoin {...props} />
      case 'SecondPassword': return <SecondPassword {...props} />
      case 'SendBitcoin': return <SendBitcoin {...props} />
      default: return <div />
    }
  }

  render () {
    return (
      <div>
        { this.props.modals.map((modal, index) => {
          return this.renderModal(modal, index)
        }) }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    modals: selectors.modals.getModals(state),
    lastModalIndex: selectors.modals.getModals(state).length - 1
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Modals)
