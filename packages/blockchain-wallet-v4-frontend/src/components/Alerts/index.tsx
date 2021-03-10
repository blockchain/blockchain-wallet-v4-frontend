import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import Alerts from './template'

const AlertsContainer = ({ alertActions, alerts }: Props) => {
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
