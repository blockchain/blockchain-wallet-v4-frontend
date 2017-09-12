
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
    const { guid, sharedKey, activityLoggingEnabled } = this.props
    const newLoggingLevel = activityLoggingEnabled ? 0 : 1
    this.props.settingsActions.updateLoggingLevel(guid, sharedKey, newLoggingLevel)
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
  activityLoggingEnabled: selectors.core.settings.getLoggingLevel(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer)
