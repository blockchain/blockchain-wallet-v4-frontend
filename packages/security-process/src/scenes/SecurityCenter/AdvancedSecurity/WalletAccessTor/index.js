import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, model, selectors } from 'data'

import WalletAccessTor from './template'

const { TOR_ACCESS } = model.analytics.PREFERENCE_EVENTS.SECURITY
class WalletAccessTorContainer extends React.PureComponent {
  handleClick = () => {
    this.props.settingsActions.updateBlockTorIps(
      Number(!this.props.blockTorIps)
    )
    this.props.analyticsActions.logEvent([
      ...TOR_ACCESS,
      !this.props.blockTorIps ? 'disable' : 'enable'
    ])
  }

  render () {
    const blockingTor = this.props.blockTorIps

    return (
      <WalletAccessTor
        {...this.props}
        handleClick={this.handleClick}
        blockingTor={blockingTor}
      />
    )
  }
}

const mapStateToProps = state => ({
  blockTorIps: selectors.core.settings.getBlockTorIps(state).getOrElse(0)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletAccessTorContainer)
