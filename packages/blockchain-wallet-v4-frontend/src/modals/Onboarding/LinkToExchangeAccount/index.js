import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import LinkToExchangeAccountError from './template.error'
import LinkToExchangeAccountLoading from './template.loading'
import LinkToExchangeAccountNotAsked from './template.notasked'
import LinkToExchangeAccountSuccess from './template.success'

class LinkToExchangeAccountContainer extends React.PureComponent {
  componentWillUnmount() {
    this.props.actions.linkToExchangeAccountReset()
  }

  onAccountLinkComplete = () => {
    const { actions, router } = this.props
    actions.closeAllModals()
    router.push('/home')
  }

  onConnectStart = () => {
    const { utmCampaign } = this.props
    this.props.actions.linkToExchangeAccount(utmCampaign)
  }

  onResendEmail = () => {
    const { actions, email } = this.props
    actions.resendVerifyEmail(email)
  }

  render() {
    return this.props.linkToExchangeStatus.cata({
      Failure: (error) => <LinkToExchangeAccountError {...this.props} error={error} />,
      Loading: () => <LinkToExchangeAccountLoading {...this.props} />,
      NotAsked: () => (
        <LinkToExchangeAccountNotAsked
          {...this.props}
          onConnectStart={this.onConnectStart}
          onResendEmail={this.onResendEmail}
        />
      ),
      Success: () => (
        <LinkToExchangeAccountSuccess
          {...this.props}
          onAccountLinkComplete={this.onAccountLinkComplete}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  deeplinkToExchange: selectors.modules.profile.getLinkToExchangeAccountDeeplink(state),
  email: selectors.core.settings.getEmail(state).getOrElse(false),
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(true),
  linkToExchangeStatus: selectors.modules.profile.getLinkToExchangeAccountStatus(state)
})

const mapDispatchToProps = (dispatch) => ({
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
  modalEnhancer('LINK_TO_EXCHANGE_ACCOUNT_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(LinkToExchangeAccountContainer)
