import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import InvoiceExpired from './template'
import modalEnhancer from 'providers/ModalEnhancer'

class BitPayInvoiceExpired extends React.PureComponent {
  render () {
    return <InvoiceExpired {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('BitPayInvoiceExpired'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(BitPayInvoiceExpired)
