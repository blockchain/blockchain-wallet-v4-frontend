import React from 'react'
import styled, { keyframes } from 'styled-components'

import { Toast } from 'blockchain-info-components'
import { media } from 'services/styles'

import getAlertContent from './messages'

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1050;

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
const easeIn = keyframes`
  0% {opacity: 0;}
  100% {opacity: 1;}
`
const AnimatedToast = styled.div`
  animation-name: ${easeIn};
  animation-duration: 0.5s;
`

const Alerts = (props) => {
  const { alerts, handleClose } = props

  return (
    <Wrapper>
      {alerts.map((alert) => {
        const { coin, data, id, message, nature, persist, timeout } = alert
        const dismissTimer = timeout || 5000
        return (
          <AnimatedToast key={id}>
            <Toast
              coin={coin}
              nature={nature}
              onClose={() => handleClose(id)}
              persist={persist}
              timeout={dismissTimer}
            >
              {getAlertContent(message, data)}
            </Toast>
          </AnimatedToast>
        )
      })}
    </Wrapper>
  )
}

export default Alerts
