import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import WalletAccessTor from './template'

class WalletAccessTorContainer extends React.PureComponent {
  handleClick = () => {
    this.props.settingsActions.updateBlockTorIps(
      Number(!this.props.blockTorIps)
    )
  }

  render() {
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
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletAccessTorContainer)
