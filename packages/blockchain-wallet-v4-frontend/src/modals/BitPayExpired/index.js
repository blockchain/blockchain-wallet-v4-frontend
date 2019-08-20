import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import BitPayExpiredModal from './template.js'

class BitPayExpired extends React.PureComponent {
  render () {
    return <BitPayExpiredModal {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('BitPayExpired'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(BitPayExpired)
