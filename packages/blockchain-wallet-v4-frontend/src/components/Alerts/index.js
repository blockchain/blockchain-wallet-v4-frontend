import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import Alerts from './template.js'

class AlertsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose (id) {
    this.props.alertActions.dismissAlert(id)
  }

  render () {
    const { alerts } = this.props

    return (
      <Alerts alerts={alerts} handleClose={this.handleClose} />
    )
  }
}

const mapStateToProps = (state) => ({
  alerts: selectors.alerts.selectAlerts(state)
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AlertsContainer)
