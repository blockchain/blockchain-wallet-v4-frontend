import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'

import { Toast } from 'blockchain-info-components'
import { selectAlerts } from 'data/alerts/selectors'
import { actions as alertsActions } from 'data/alerts/slice'
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

const DISMISS_ALERT_TIME = 5000

const Alerts = () => {
  const alerts = useSelector(selectAlerts)
  const dispatch = useDispatch()

  return (
    <Wrapper>
      {alerts.map((alert) => {
        const { coin, data, id, message, nature, persist } = alert
        return (
          <AnimatedToast key={id}>
            <Toast
              coin={coin}
              nature={nature}
              onClose={() => dispatch(alertsActions.dismissAlert(id))}
              persist={persist}
              timeout={DISMISS_ALERT_TIME}
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
