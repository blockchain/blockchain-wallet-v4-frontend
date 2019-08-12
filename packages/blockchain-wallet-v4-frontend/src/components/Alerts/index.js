import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import styled from 'styled-components'

import { getAlertContent } from './messages'
import AlertToast from './template'

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1050;
  & > * {
    margin-top: 5px;
  }
  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    width: 95%;
  }
  @media (min-width: 768px) {
    top: 65px;
    right: 22px;
    width: auto;
  }
`

class AlertsContainer extends React.PureComponent {
  handleClose = id => {
    this.props.alertActions.dismissAlert(id)
  }

  render () {
    const { alerts } = this.props
    return (
      <Wrapper>
        {alerts.map(alert => {
          const { id, nature, message, data, coin, timeout, persist } = alert
          return (
            <AlertToast
              id={id}
              key={id}
              nature={nature}
              coin={coin}
              onClose={this.handleClose}
              persist={persist}
              timeout={timeout}
            >
              {getAlertContent(message, data)}
            </AlertToast>
          )
        })}
      </Wrapper>
    )
  }
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
