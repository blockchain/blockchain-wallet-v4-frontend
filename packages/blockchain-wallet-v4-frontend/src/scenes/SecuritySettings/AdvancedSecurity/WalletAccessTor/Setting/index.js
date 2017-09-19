
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { guid, sharedKey, blockTorIps } = this.props
    const newBlockTorIps = Number(!blockTorIps)
    this.props.settingsActions.updateBlockTorIps(guid, sharedKey, newBlockTorIps)
  }

  render () {
    const { ...rest } = this.props

    return <Settings
      {...rest}
      handleClick={this.handleClick}
    />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  blockTorIps: selectors.core.settings.getBlockTorIps(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer)
