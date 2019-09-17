import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { getAlertContent } from './messages'
import { Icon, Toast } from 'blockchain-info-components'

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
            {nature === 'success' ? (
              <Icon
                name='checkmark-in-square'
                size='24px'
                color='brand-secondary'
              />
            ) : null}
            {getAlertContent(message, data, handleClose, id)}
          </Toast>
        )
      })}
    </Wrapper>
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
