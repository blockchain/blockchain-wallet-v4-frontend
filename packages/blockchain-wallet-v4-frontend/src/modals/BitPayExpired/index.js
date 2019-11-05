import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions } from 'data'
import BitPayExpiredModal from './template.js'
import modalEnhancer from 'providers/ModalEnhancer'

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
