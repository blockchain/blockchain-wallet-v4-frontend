import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import ThePit from './template'

class ThePitContainer extends React.PureComponent {
  onSignup = () => {
    this.props.modalActions.showModal('LinkToPitAccount')
    this.props.profileActions.createLinkAccountId()
  }

  render () {
    const { currentUserTier } = this.props

    return <ThePit currentUserTier={currentUserTier} onSignup={this.onSignup} />
  }
}

const mapStateToProps = state => ({
  currentUserTier: selectors.modules.profile
    .getUserTiers(state)
    .getOrElse({ current: 0 })
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThePitContainer)
