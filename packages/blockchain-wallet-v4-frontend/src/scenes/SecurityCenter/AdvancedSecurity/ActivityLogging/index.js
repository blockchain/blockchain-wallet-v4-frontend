import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, model, selectors } from 'data'

import ActivityLogging from './template'

const { ACTIVITY_LOGGING } = model.analytics.PREFERENCE_EVENTS.SECURITY
class ActivityLoggingContainer extends React.PureComponent {
  handleClick = () => {
    const { activityLoggingEnabled } = this.props
    this.props.settingsActions.updateLoggingLevel(
      Number(!activityLoggingEnabled)
    )
    this.props.analyticsActions.logEvent([
      ...ACTIVITY_LOGGING,
      !activityLoggingEnabled ? 'enable' : 'disable'
    ])
  }

  render () {
    const { activityLoggingEnabled, ...rest } = this.props
    return (
      <ActivityLogging
        {...rest}
        handleClick={this.handleClick}
        logging={activityLoggingEnabled}
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityLoggingContainer)
