import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Home from 'components/Home'

import * as activityActions from 'data/Activity/actions.js'

class HomeContainer extends React.Component {
  componentWillMount () {
    this.props.actions.fetchActivities()
  }

  render () {
    return (
      <Home activities={this.props.activities} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    activities: state.activityState.activities
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(activityActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
