import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

import { actions, selectors } from 'data'
import LinkToExchangeAccountError from './template.error'
import LinkToExchangeAccountLoading from './template.loading'
import LinkToExchangeAccountNotAsked from './template.notasked'
import LinkToExchangeAccountSuccess from './template.success'

class LinkToExchangeAccountContainer extends React.PureComponent {
  componentWillUnmount () {
    this.props.actions.linkToPitAccountReset()
    this.props.actions.hideThePitPulse()
  }

  onAccountLinkComplete = () => {
    const { actions, router } = this.props
    actions.closeAllModals()
    router.push('/home')
  }

  onConnectStart = () => {
    const { utmCampaign } = this.props
    this.props.actions.linkToPitAccount(utmCampaign)
  }

  onResendEmail = () => {
    const { actions, email } = this.props
    actions.resendVerifyEmail(email)
  }

  render () {
    return this.props.linkToPitStatus.cata({
      Success: () => (
        <LinkToExchangeAccountSuccess
          {...this.props}
          onAccountLinkComplete={this.onAccountLinkComplete}
        />
      ),
      Failure: error => (
        <LinkToExchangeAccountError {...this.props} error={error} />
      ),
      Loading: () => <LinkToExchangeAccountLoading {...this.props} />,
      NotAsked: () => (
        <LinkToExchangeAccountNotAsked
          {...this.props}
          onConnectStart={this.onConnectStart}
          onResendEmail={this.onResendEmail}
        />
      )
    })
  }
}

const mapStateToProps = state => ({
  deeplinkToExchange: selectors.modules.profile.getLinkToPitAccountDeeplink(
    state
  ),
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
      ...actions.preferences,
      ...actions.modals,
      ...actions.modules.profile,
      ...actions.modules.securityCenter
    },
    dispatch
  ),
  router: bindActionCreators(actions.router, dispatch)
})

const enhance = compose(
  modalEnhancer('LinkToExchangeAccount'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LinkToExchangeAccountContainer)
