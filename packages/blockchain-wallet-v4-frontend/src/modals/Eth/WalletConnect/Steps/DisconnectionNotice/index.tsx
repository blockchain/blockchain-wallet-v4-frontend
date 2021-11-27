import React from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const DisconnectionNoticeStep = (props) => {
  const { handleClose, sessionDetails } = props
  return (
    <Wrapper>
      {!sessionDetails && (
        <Text weight={600} color='grey600' size='20px'>
          Failure to establish or maintain connection!
        </Text>
      )}
      {sessionDetails && (
        <>
          <img
            alt='Dapp Logo'
            height='100px'
            width='auto'
            style={{ marginBottom: '0.5rem' }}
            src={sessionDetails.peerMeta.icons[0]}
          />
          <Text weight={600} color='grey600' size='20px' style={{ marginBottom: '3.5rem' }}>
            Your session with {sessionDetails.peerMeta.name} has ended.
          </Text>
          <Button
            fullwidth
            height='48px'
            data-e2e='acceptConnection'
            nature='primary'
            size='16px'
            onClick={handleClose}
          >
            Close
          </Button>
        </>
      )}
    </Wrapper>
  )
}

export default DisconnectionNoticeStep
