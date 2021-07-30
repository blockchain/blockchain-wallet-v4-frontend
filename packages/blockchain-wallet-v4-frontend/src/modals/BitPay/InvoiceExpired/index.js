import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import InvoiceExpired from './template'

class BitPayInvoiceExpired extends React.PureComponent {
  render() {
    return <InvoiceExpired {...this.props} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('BITPAY_INVOICE_EXPIRED_MODAL'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(BitPayInvoiceExpired)
