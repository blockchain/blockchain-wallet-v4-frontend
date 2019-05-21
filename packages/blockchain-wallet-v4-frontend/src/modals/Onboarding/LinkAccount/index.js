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
    const status = this.props.linkAccountStatus.cata({
      Success: msg => msg,
      Failure: e => e.description,
      Loading: () => 'Loading',
      NotAsked: () => 'Not Asked'
    })
    return <LinkAccount {...this.props} status={status} />
  }
}

const mapStateToProps = state => ({
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
