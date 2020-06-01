import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import Alerts from './template'
import React from 'react'

const AlertsContainer = ({ alerts, alertActions }: Props) => {
  return (
    <Alerts
      alerts={alerts || []}
      handleClose={id => alertActions.dismissAlert(id)}
    />
  )
}

const mapStateToProps = state => ({
  alerts: selectors.alerts.selectAlerts(state)
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(AlertsContainer)
