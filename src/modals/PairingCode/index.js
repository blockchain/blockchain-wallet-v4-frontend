import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'components/providers/ModalEnhancer'
import PairingCode from './template.js'

class PairingCodeContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose () {
    this.props.modalActions.closeModal()
  }

  render () {
    return <PairingCode {...this.props} handleClose={this.handleClose} />
  }
}

const mapStateToProps = (state) => {
  return {
    guid: selectors.core.wallet.getGuid(state),
    sharedKey: selectors.core.wallet.getSharedKey(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('PairingCode'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(PairingCodeContainer)
