import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import Setup from './template.js'

class OnboardContainer extends React.PureComponent {
  launchLockboxSetup = () => {
    this.props.modalActions.showModal('LockboxSetup')
  }

  render () {
    const { domainsR } = this.props
    const domains = domainsR.getOrElse({ comRoot: 'https://blockchain.com' })

    return (
      <Setup launchLockboxSetup={this.launchLockboxSetup} domains={domains} />
    )
  }
}

const mapStateToProps = state => ({
  domainsR: selectors.core.walletOptions.getDomains(state)
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardContainer)
