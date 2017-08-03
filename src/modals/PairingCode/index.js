import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
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
    console.log(this.props)
    return <PairingCode {...this.props} handleClose={this.handleClose} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('PairingCode'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(PairingCodeContainer)
