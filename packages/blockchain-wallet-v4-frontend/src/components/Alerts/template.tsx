import { Toast } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

import { getAlertContent } from './messages'

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
      {alerts.map(alert => {
        const { id, nature, message, data, coin, persist, timeout } = alert
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
    </Wrapper>
  )
}

export default Alerts
