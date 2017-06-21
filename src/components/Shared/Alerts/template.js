import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import style from './style.scss'

const alertFactory = ({ onDismiss }) => ({ type, message, id }) => (
  <div key={id} styleName='alert' className={`alert alert-${type} alert-dismissable`}>
    <button styleName='close' className='close' onClick={() => onDismiss(id)}>
      <span>x</span>
    </button>
    <div key={id}><span>{message}</span></div>
  </div>
)

const Alerts = ({ alerts, dismissAlert }) => {
  let createAlert = alertFactory({ onDismiss: dismissAlert })
  return (
    <div styleName='alerts'>
      {alerts.filter(a => !a.dismissed).map(createAlert)}
    </div>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    dismissed: PropTypes.bool
  }))
}

export default CSSModules(Alerts, style)
