import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ActivityList from './template.js'
import { actions } from 'data'

class ActivityContainer extends React.Component {
  render () {
    return (
      <ActivityList activities={this.props.activities} />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activities: state.applicationState.activities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.activity, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityContainer)
