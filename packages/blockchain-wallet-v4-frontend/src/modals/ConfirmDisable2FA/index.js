import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import ConfirmDisable2FA from './template.js'

class ConfirmDisable2FAContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    this.props.modalActions.clickWelcomeContinue()
  }

  render () {
    console.log('confirmdisable2fa', this.props)
    return (
      <ConfirmDisable2FA {...this.props} handleContinue={this.handleContinue} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('ConfirmDisable2FA'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(ConfirmDisable2FAContainer)
