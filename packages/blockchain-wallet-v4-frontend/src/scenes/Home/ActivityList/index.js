import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { take } from 'ramda'

import ActivityList from './template.js'
import { actions, selectors } from 'data'

class ActivityContainer extends React.Component {
  componentWillMount () {
    this.props.actions.initActivity()
  }

  render () {
    const lastActivities = take(8, this.props.activity.data)

    return <ActivityList activities={lastActivities} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  activity: selectors.modules.activity.getActivity(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modules.activity, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityContainer)
