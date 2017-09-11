import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import PairingCode from './template.js'

class PairingCodeContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.modalActions.closeModal()
  }

  render () {
    return <PairingCode {...this.props} handleClick={this.handleClick} />
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
