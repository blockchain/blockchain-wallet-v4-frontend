import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 30px;
  box-sizing: border-box;
`

const Lockbox = props => {
  const { deviceId, deviceName, deleteDevice } = props
  return (
    <Wrapper>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text size='18px' weight={400}>
          Device ID:<Text size='14px' weight={300}>
            {deviceId}
          </Text>
        </Text>
        <Text size='18px' weight={400} style={{ marginTop: '5px' }}>
          Device Name:<Text size='14px' weight={300}>
            {deviceName}
          </Text>
        </Text>
      </div>
      <Button nature='sent' onClick={deleteDevice}>
        <FormattedMessage
          id='scenes.lockbox.welcome.deletedevice'
          defaultMessage='Delete Device'
        />
      </Button>
    </Wrapper>
  )
}

export default Lockbox
