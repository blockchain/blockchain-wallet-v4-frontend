import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'

import ActivityLogging from './template.js'

class ActivityLoggingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.settingsActions.updateLoggingLevel(Number(!this.props.activityLoggingEnabled.data))
  }

  render () {
    const { activityLoggingEnabled, ...rest } = this.props
    const loggingEnabled = activityLoggingEnabled.data

    return <ActivityLogging {...rest} handleClick={this.handleClick} logging={loggingEnabled} />
  }
}

const mapStateToProps = (state) => ({
  activityLoggingEnabled: selectors.core.settings.getLoggingLevel(state)
})
const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLoggingContainer)
