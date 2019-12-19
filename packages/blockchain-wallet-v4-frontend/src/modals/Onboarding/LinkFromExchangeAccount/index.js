import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

import { actions, selectors } from 'data'
import LinkFromExchangeAccount from './template'

class LinkFromExchangeAccountContainer extends React.PureComponent {
  componentDidMount () {
    const { linkId } = this.props
    this.props.actions.linkFromExchangeAccount(linkId)
  }

  render () {
    return <LinkFromExchangeAccount {...this.props} />
  }
}

const mapStateToProps = state => ({
  email: selectors.core.settings.getEmail(state).getOrElse(false),
  emailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(true),
  linkFromExchangeAccountStatus: selectors.modules.profile.getLinkFromExchangeAccountStatus(
    state
  ),
  userTiers: selectors.modules.profile.getUserTiers(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...actions.modules.profile,
      ...actions.modules.securityCenter
    },
    dispatch
  )
})

const enhance = compose(
  modalEnhancer('LinkFromExchangeAccount'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LinkFromExchangeAccountContainer)
