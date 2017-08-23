import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'ramda'

import ActivityList from './template.js'
import { actions, selectors } from 'data'

class ActivityContainer extends React.Component {
  componentWillMount () {
    const { logs, logActions, guid, sharedKey } = this.props
    if (isEmpty(logs)) { logActions.fetchLogs(guid, sharedKey) }
  }

  render () {
    return (
      <ActivityList activities={this.props.logs} />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  logs: selectors.core.logs.selectLogs(state),
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state)
})

const mapDispatchToProps = (dispatch) => ({
  logActions: bindActionCreators(actions.core.logs, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityContainer)
