import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { selectAlerts } from 'data/Alerts/selectors'
import * as actions from 'data/Alerts/actions'

const AlertsList = styled.div`
  top: 16px;
  right: 16px;
  z-index: 1051;
  position: fixed;
  min-width: 300px;
`

const alertFactory = ({ onDismiss }) => ({ type, message, id }) => (
  <div key={id} className={`alert alert-${type} alert-dismissable`}>
    <button type='button' className='close' onClick={() => onDismiss(id)}>
      <span>&times;</span>
    </button>
    <div key={id}><span>{message}</span></div>
  </div>
)

export const Alerts = ({ alerts, dismissAlert }) => {
  let createAlert = alertFactory({ onDismiss: dismissAlert })
  return (
    <AlertsList>
      {alerts.filter(a => !a.dismissed).map(createAlert)}
    </AlertsList>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    dismissed: PropTypes.bool
  }))
}

let mapStateToProps = (state) => ({ alerts: selectAlerts(state) })
let mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)
