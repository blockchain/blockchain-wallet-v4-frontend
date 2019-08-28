import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'

import LinkToPitNotAsked from './template.notasked'
import LinkToPitLoading from './template.loading'
import LinkToPitError from './template.error'
import LinkToPitSuccess from './template.success'
import { actions, selectors } from 'data'

class LinkToPitAccountContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.actions.linkToPitAccountReset()
  }

  onAccountLinkComplete = () => {
    const { actions, router } = this.props
    actions.closeAllModals()
    router.push('/home')
  }

  onConnectStart = () => {
    this.props.actions.linkToPitAccount()
  }

  onResendEmail = () => {
    const { actions, email } = this.props
    actions.resendVerifyEmail(email)
  }

  render () {
    return this.props.linkToPitStatus.cata({
      Success: () => (
        <LinkToPitSuccess
          {...this.props}
          onAccountLinkComplete={this.onAccountLinkComplete}
        />
      ),
      Failure: error => <LinkToPitError {...this.props} error={error} />,
      Loading: () => <LinkToPitLoading {...this.props} />,
      NotAsked: () => (
        <LinkToPitNotAsked
          {...this.props}
          onConnectStart={this.onConnectStart}
          onResendEmail={this.onResendEmail}
        />
      )
    })
  }
}

const mapStateToProps = state => ({
  deeplinkToPit: selectors.modules.profile.getLinkToPitAccountDeeplink(state),
  email: selectors.core.settings.getEmail(state).getOrElse(false),
  isEmailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(true),
  linkToPitStatus: selectors.modules.profile.getLinkToPitAccountStatus(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...actions.components.identityVerification,
      ...actions.modals,
      ...actions.modules.profile,
      ...actions.modules.securityCenter
    },
    dispatch
  ),
  router: bindActionCreators(actions.router, dispatch)
})

const enhance = compose(
  modalEnhancer('LinkToPitAccount'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LinkToPitAccountContainer)
