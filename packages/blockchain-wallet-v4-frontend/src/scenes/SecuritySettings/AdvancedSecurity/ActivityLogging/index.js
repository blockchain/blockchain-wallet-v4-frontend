import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import ActivityLogging from './template.js'

class ActivityLoggingContainer extends React.Component {
  render () {
    return <ActivityLogging {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  activityLoggingEnabled: selectors.core.settings.getLoggingLevel(state) === 1
})

export default connect(mapStateToProps)(ActivityLoggingContainer)
