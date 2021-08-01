import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const SessionDashboardStep = (props) => {
  const { sessionDetails } = props
  return (
    <Wrapper>
      <img
        alt='Dapp Logo'
        height='100px'
        width='auto'
        style={{ marginBottom: '0.5rem' }}
        src={sessionDetails.peerMeta.icons[0]}
      />
      <Text weight={600} color='grey600' size='20px'>
        Connected to {sessionDetails.peerMeta.name}. Waiting for instructions...
      </Text>
    </Wrapper>
  )
}

export default SessionDashboardStep
