import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { selectAlerts } from 'data/Alerts/selectors'
import { clearAlerts, dismissAlert } from 'data/Alerts/actions'
import Alerts from './template.js'

const AlertsContainer = (props) => <Alerts {...props} />

let mapStateToProps = (state) => ({ alerts: selectAlerts(state) })
let mapDispatchToProps = (dispatch) => bindActionCreators({ clearAlerts, dismissAlert }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AlertsContainer)
