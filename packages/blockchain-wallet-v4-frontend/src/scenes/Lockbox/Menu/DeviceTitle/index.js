import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Text } from 'blockchain-info-components'

const ToggleIcon = styled(Icon)`
  transition: color 0.3s;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
  }
`

const DeviceTitle = props => {
  const { deviceInfo, location } = props
  const onDashboard = location.pathname.includes('/lockbox/dashboard')
  const linkTo = onDashboard ? '/lockbox/settings' : '/lockbox/dashboard'
  const icon = onDashboard ? 'settings-filled' : 'transactions'

  return deviceInfo ? (
    <React.Fragment>
      <Text size='24px' weight={400}>
        {deviceInfo.device_name}
      </Text>
      <LinkContainer to={linkTo}>
        <ToggleIcon name={icon} size={'24px'} />
      </LinkContainer>
    </React.Fragment>
  ) : (
    <Text size='24px' weight={400}>
      Lockbox
    </Text>
  )
}

export default DeviceTitle
