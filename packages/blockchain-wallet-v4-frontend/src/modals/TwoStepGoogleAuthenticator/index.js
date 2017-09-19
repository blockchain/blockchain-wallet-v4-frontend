import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepGoogleAuthenticator from './template.js'

class TwoStepGoogleAuthenticatorContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { guid, sharedKey, code } = this.props
    this.props.settingsActions.confirmGoogleAuthenticator(guid, sharedKey, code)
  }

  render () {
    return (
      <TwoStepGoogleAuthenticator {...this.props} handleClick={this.handleClick} />
    )
  }
}
const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  code: formValueSelector('twoStepGoogleAuthenticator')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('TwoStepGoogleAuthenticator'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TwoStepGoogleAuthenticatorContainer)
