import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import Alerts from './template.js'

const AlertsContainer = ({ alerts, alertActions, onboardingActions }) => {
  return (
    <Alerts alerts={alerts} handleClose={id => alertActions.dismissAlert(id)} />
  )
}

const mapStateToProps = state => ({
  alerts: selectors.alerts.selectAlerts(state)
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsContainer)
