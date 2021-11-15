import React from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const AuthorizeConnectionStep = (props) => {
  const sessionDetails = props.data
  const approveRequest = () => {
    props.walletConnectActions.respondToSessionRequest({ action: 'APPROVE', sessionDetails })
  }
  const rejectRequest = () => {
    props.walletConnectActions.respondToSessionRequest({ action: 'REJECT', sessionDetails })
  }

  return (
    <Wrapper>
      <img
        alt='Dapp Logo'
        height='100px'
        width='auto'
        style={{ marginBottom: '0.5rem' }}
        src={sessionDetails.peerMeta.icons[0]}
      />
      <Text weight={600} color='grey600' size='20px' style={{ marginBottom: '3.5rem' }}>
        {sessionDetails.peerMeta.name} is requesting to connect your ETH Private Key Wallet.
      </Text>
      <Button
        fullwidth
        height='48px'
        data-e2e='acceptConnection'
        nature='primary'
        size='16px'
        style={{ marginBottom: '1rem' }}
        onClick={approveRequest}
      >
        Approve Connection
      </Button>
      <Button
        fullwidth
        height='48px'
        data-e2e='rejectConnection'
        nature='warning'
        size='16px'
        onClick={rejectRequest}
      >
        Reject Connection
      </Button>
    </Wrapper>
  )
}

export default AuthorizeConnectionStep
