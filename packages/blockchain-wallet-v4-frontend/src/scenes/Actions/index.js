import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import base64 from 'base-64'
import { actions } from 'data'

class ActionsContainer extends React.Component {
  componentWillMount () {
    const { payload } = this.props.match.params
    const { name, data } = JSON.parse(base64.decode(payload))

    this.props.goalsActions.saveGoal(name, data)
    this.props.routerActions.push('/wallet')
  }

  render () {
    return <div />
  }
}

const mapDispatchToProps = (dispatch) => ({
  goalsActions: bindActionCreators(actions.goals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ActionsContainer)
