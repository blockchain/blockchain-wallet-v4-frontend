import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Toast } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1050;

  & > * { margin-top: 5px; }

  @media(min-width: 768px) { 
    bottom: 5px;
    left: 5px;
    width: auto;
  }
`

const selectHeader = nature => {
  switch (nature) {
    case 'info': return <FormattedMessage id='components.alerts.info' defaultMessage='Alert' />
    case 'success': return <FormattedMessage id='components.alerts.success' defaultMessage='Success' />
    case 'error': return <FormattedMessage id='components.alerts.error' defaultMessage='Error' />
    default: return <FormattedMessage id='components.alerts.default' defaultMessage='Alert' />
  }
}

const selectMessage = (message, data = undefined) => {
  switch (message) {
    case 'authorization_required': return <FormattedMessage id='components.alerts.authorization_required' defaultMessage='Authorization required, check your inbox' />
    case 'login_failed': return <FormattedMessage id='components.alerts.login_failed' defaultMessage='Login failed !' />
    case 'login_successful': return <FormattedMessage id='components.alerts.login_successful' defaultMessage='Login successful !' />
    default: return <span>{`${message}`}</span>
  }
}

const Alerts = props => {
  const { alerts, handleClose } = props

  return (
    <Wrapper>
      { alerts.map((alert, index) => {
        const { id, nature, message, data } = alert
        return (
          <Toast key={index} nature={nature} onClose={() => handleClose(id)}>
            {selectHeader(nature)}
            {selectMessage(message, data)}
          </Toast>
        )
      })}
    </Wrapper>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    nature: PropTypes.oneOf(['info', 'error', 'success']),
    message: PropTypes.string.isRequired,
    data: PropTypes.object
  }))
}

export default Alerts
