import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'

import ActivityLogging from './template.js'

class ActivityLoggingContainer extends React.PureComponent {
  handleClick = () => {
    this.props.settingsActions.updateLoggingLevel(
      Number(!this.props.activityLoggingEnabled)
    )
  }

  render () {
    const { activityLoggingEnabled, ...rest } = this.props
    const loggingEnabled = activityLoggingEnabled

    return (
      <ActivityLogging
        {...rest}
        handleClick={this.handleClick}
        logging={loggingEnabled}
      />
    )
  }
}

const mapStateToProps = state => ({
  activityLoggingEnabled: selectors.core.settings
    .getLoggingLevel(state)
    .getOrElse(0)
})
const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityLoggingContainer)
