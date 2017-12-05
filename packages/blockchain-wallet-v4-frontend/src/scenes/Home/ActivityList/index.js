import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty, take } from 'ramda'

import ActivityList from './template.js'
import { actions, selectors } from 'data'

class ActivityContainer extends React.Component {
  componentWillMount () {
    if (isEmpty(this.props.logs)) { this.props.dataActions.getLogs() }
  }

  render () {
    const lastLogs = take(8, this.props.logs)

    return <ActivityList activities={lastLogs} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  logs: selectors.core.data.misc.getLogs(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityContainer)
