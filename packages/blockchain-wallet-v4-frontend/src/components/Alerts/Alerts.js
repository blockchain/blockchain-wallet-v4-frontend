import React from 'react'
import PropTypes from 'prop-types'
import AlertsList from './AlertsList'
import Alert from './Alert'

const Alerts = ({ alerts, dismissAlert }) => (
  <AlertsList>
    {alerts.filter(a => !a.dismissed).map(alert =>
      <Alert key={alert.id} {...alert} onDismiss={dismissAlert} />
    )}
  </AlertsList>
)

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    dismissed: PropTypes.bool
  }))
}

export default Alerts
