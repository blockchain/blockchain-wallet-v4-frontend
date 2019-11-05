import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

import { actions, selectors } from 'data'
import LinkFromPitAccount from './template'

class LinkFromPitAccountContainer extends React.PureComponent {
  componentDidMount () {
    const { linkId } = this.props
    this.props.actions.linkFromPitAccount(linkId)
  }

  render () {
    return <LinkFromPitAccount {...this.props} />
  }
}

const mapStateToProps = state => ({
  email: selectors.core.settings.getEmail(state).getOrElse(false),
  emailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(true),
  linkFromPitAccountStatus: selectors.modules.profile.getLinkFromPitAccountStatus(
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
  modalEnhancer('LinkFromPitAccount'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LinkFromPitAccountContainer)
