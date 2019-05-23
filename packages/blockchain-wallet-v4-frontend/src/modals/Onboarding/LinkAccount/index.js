import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import LinkAccount from './template.js'
import { actions, selectors } from 'data'

class LinkAccountContainer extends React.PureComponent {
  componentDidMount () {
    const { linkId } = this.props
    this.props.actions.linkAccount(linkId)
  }

  render () {
    return <LinkAccount {...this.props} />
  }
}

const mapStateToProps = state => ({
  userTiers: selectors.modules.profile.getUserTiers(state),
  linkAccountStatus: selectors.modules.profile.getLinkAccountStatus(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.profile, dispatch)
})

const enhance = compose(
  modalEnhancer('LinkAccount'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(LinkAccountContainer)
