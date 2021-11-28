import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 120px);
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
      <Text weight={600} color='grey900' size='20px'>
        <FormattedMessage
          id='scenes.walletconnect.wallet_connected'
          defaultMessage='Your wallet is now connected to {dapp}!'
          values={{
            dapp: sessionDetails.peerMeta.name
          }}
        />
      </Text>
      <Text weight={600} color='grey600' size='14px' style={{ marginTop: '10px' }}>
        <FormattedMessage
          id='scenes.walletconnect.awaiting_transaction'
          defaultMessage='Go back to {dapp} to initiate a transaction.'
          values={{
            dapp: sessionDetails.peerMeta.name
          }}
        />
      </Text>
    </Wrapper>
  )
}

export default SessionDashboardStep
