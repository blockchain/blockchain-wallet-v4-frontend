import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  box-sizing: border-box;
`

const Lockbox = props => {
  const { addDevice, deviceId, deviceName, deleteDevice } = props
  return (
    <Wrapper>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '10px'
        }}
      >
        <Button nature='primary' onClick={addDevice}>
          <FormattedMessage
            id='scenes.lockbox.welcome.addanotherdevice'
            defaultMessage='Add Another Device'
          />
        </Button>
      </div>
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid grey',
          borderBottom: '1px solid grey'
        }}
      >
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
        <Button nature='sent' onClick={deleteDevice}>
          <FormattedMessage
            id='scenes.lockbox.welcome.deletedevice'
            defaultMessage='Delete Device'
          />
        </Button>
      </div>
    </Wrapper>
  )
}

export default Lockbox
