
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'

import WalletAccessTor from './template.js'

class WalletAccessTorContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.settingsActions.updateBlockTorIps(Number(!this.props.blockTorIps.data))
  }

  render () {
    const blockingTor = this.props.blockTorIps.data

    return <WalletAccessTor {...this.props} handleClick={this.handleClick} blockingTor={blockingTor} />
  }
}

const mapStateToProps = (state) => ({
  blockTorIps: selectors.core.settings.getBlockTorIps(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletAccessTorContainer)
