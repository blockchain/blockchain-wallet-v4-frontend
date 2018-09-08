import React from 'react'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon, Text } from 'blockchain-info-components'

const SettingsIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`

const DeviceTitle = props => {
  const { deviceInfo } = props

  return deviceInfo ? (
    <React.Fragment>
      <Text size='24px' weight={400}>
        {deviceInfo.device_name}
      </Text>
      <LinkContainer to='/lockbox/settings'>
        <SettingsIcon name='settings-filled' size={'24px'} />
      </LinkContainer>
    </React.Fragment>
  ) : (
    <Text size='24px' weight={400}>
      Lockbox
    </Text>
  )
}

export default DeviceTitle
