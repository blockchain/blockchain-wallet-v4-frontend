import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styled from 'styled-components'

import { Toast } from 'blockchain-info-components'
import { media } from 'services/styles'

import { getAlertContent } from './messages'

const duration = 200

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1050;

  .toast-enter {
    opacity: 0.01;
    position: absolute;
  }

  .toast-enter.toast-enter-active {
    opacity: 1;
    transition: opacity ${duration}ms;
  }

  .toast-leave.toast-leave-active {
    opacity: 0.01;
    transition: opacity ${duration}ms;
  }

  ${media.tablet`
    bottom: 10px;
    right: 10px;
    width: 95%;
  `}
  ${media.atLeastTablet`
    top: 65px;
    right: 22px;
    width: auto;
  `}
`

const Alerts = props => {
  const { alerts, handleClose } = props

  return (
    <Wrapper>
      <ReactCSSTransitionGroup
        transitionName='toast'
        transitionEnterTimeout={duration}
        transitionLeaveTimeout={duration}
      >
        {alerts.map(alert => {
          const { coin, data, id, message, nature, persist, timeout } = alert
          const dismissTimer = timeout || 7000
          return (
            <Toast
              key={id}
              nature={nature}
              coin={coin}
              timeout={dismissTimer}
              persist={persist}
              onClose={() => handleClose(id)}
            >
              {getAlertContent(message, data)}
            </Toast>
          )
        })}
      </ReactCSSTransitionGroup>
    </Wrapper>
  )
}

export default Alerts
