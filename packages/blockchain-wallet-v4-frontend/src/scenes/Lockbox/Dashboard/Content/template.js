import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  box-sizing: border-box;
`
const Device = styled.div`
  padding: 10px;
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
`

const Lockbox = props => {
  const { devices, addDevice, deleteDevice } = props
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
    </Wrapper>
  )
}

export default Lockbox
