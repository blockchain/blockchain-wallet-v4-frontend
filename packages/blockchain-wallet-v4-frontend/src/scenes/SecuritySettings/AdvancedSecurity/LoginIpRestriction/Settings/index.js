import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'

import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { guid, sharedKey, ipLockOn } = this.props
    const newIpLockOn = Number(!ipLockOn)
    this.props.settingsActions.updateIpLockOn(guid, sharedKey, newIpLockOn)
  }

  render () {
    const { ui, ...rest } = this.props

    return <Settings
      {...rest}
      handleClick={this.handleClick}
    />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  ipLockOn: selectors.core.settings.getIpLockOn(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
