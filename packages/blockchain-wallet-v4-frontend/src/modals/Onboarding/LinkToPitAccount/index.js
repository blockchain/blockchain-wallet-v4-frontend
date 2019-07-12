import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'

import LinkToPitAccount from './template'
import { actions, selectors } from 'data'

class LinkToPitAccountContainer extends React.PureComponent {
  onConnectStart = () => {
    this.props.actions.linkToPitAccount()
  }

  onResendEmail = () => {
    const { actions, email } = this.props
    actions.resendVerifyEmail(email)
  }

  render () {
    return (
      <LinkToPitAccount
        {...this.props}
        onConnectStart={this.onConnectStart}
        onResendEmail={this.onResendEmail}
      />
    )
  }
}

const mapStateToProps = state => ({
  email: selectors.core.settings.getEmail(state).getOrElse(false),
  isEmailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(true)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...actions.components.identityVerification,
      ...actions.modules.profile,
      ...actions.modules.securityCenter
    },
    dispatch
  )
})

const enhance = compose(
  modalEnhancer('LinkToPitAccount'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LinkToPitAccountContainer)
