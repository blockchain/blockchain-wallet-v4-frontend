import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from 'data'
import Alerts from './template.js'

const AlertsContainer = (props) => <Alerts {...props} />

let mapStateToProps = (state) => ({
  alerts: state.applicationState.alerts
})

let mapDispatchToProps = (dispatch) => bindActionCreators({
  clearAlerts: actions.alerts.clearAlerts,
  dismissAlert: actions.alerts.dismissAlert
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AlertsContainer)
