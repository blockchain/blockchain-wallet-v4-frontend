import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepGoogleAuthenticator from './template.js'

class TwoStepGoogleAuthenticatorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.modalActions.clickTwoStepGoogleAuthenticatorEnable()
  }

  render () {
    return (
      <TwoStepGoogleAuthenticator {...this.props} handleClick={this.handleClick} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepGoogleAuthenticator'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(TwoStepGoogleAuthenticatorContainer)
