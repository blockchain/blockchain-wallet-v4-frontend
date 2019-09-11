import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { getAlertContent } from './messages'
import { Toast } from 'blockchain-info-components'

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
            {nature === 'success' ? <SuccessCheckmark /> : null}
            {getAlertContent(message, data, handleClose, id)}
          </Toast>
        )
      })}
    </Wrapper>
  )
}

const SuccessCheckmark = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M21.3333 0H2.66667C1.18667 0 0 1.2 0 2.66667V21.3333C0 22.8 1.18667 24 2.66667 24H21.3333C22.8133 24 24 22.8 24 21.3333V2.66667C24 1.2 22.8133 0 21.3333 0ZM9.33333 18.6667L2.66667 12L4.54667 10.12L9.33333 14.8933L19.4533 4.77333L21.3333 6.66667L9.33333 18.6667Z'
        fill='#0C6CF2'
      />
    </svg>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      id: PropTypes.string.isRequired,
      nature: PropTypes.oneOf(['info', 'error', 'success']),
      message: PropTypes.string.isRequired,
      data: PropTypes.object
    })
  )
}

export default Alerts
