import React from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ApproveTransactionStep = (props) => {
  const { data: requestDetails, sessionDetails } = props
  const txDetails = requestDetails.params[0]
  const approveRequest = () => {
    props.walletConnectActions.respondToTxSendRequest({ action: 'APPROVE', requestDetails })
  }
  const rejectRequest = () => {
    props.walletConnectActions.respondToTxSendRequest({ action: 'REJECT', requestDetails })
  }

  return (
    <Wrapper>
      <div style={{ height: '33%' }} />
      <div style={{ height: '33%' }}>
        <img
          alt='Dapp Logo'
          height='100px'
          width='auto'
          style={{ marginBottom: '0.5rem' }}
          src='https://example.walletconnect.org/favicon.ico'
        />
        <Text weight={600} color='grey900' size='20px' style={{ marginBottom: '1rem' }}>
          Sushi wants to connect
        </Text>
        <Text weight={500} color='grey600' size='14px' style={{ marginBottom: '0.5rem' }}>
          url
        </Text>
        {/* <Text weight={600} color='grey600' size='12px' style={{ marginBottom: '3.5rem' }}>
          <pre>{JSON.stringify(txDetails, null, 2)}</pre>
        </Text> */}
      </div>
      <div style={{ height: '33%', width: '100%' }}>
        <Button
          fullwidth
          height='48px'
          data-e2e='rejectTransaction'
          nature='light-red'
          size='16px'
          onClick={rejectRequest}
          style={{ marginBottom: '1rem' }}
        >
          Cancel
        </Button>
        <Button
          fullwidth
          height='48px'
          data-e2e='acceptTransaction'
          nature='primary'
          size='16px'
          onClick={approveRequest}
        >
          Confirm
        </Button>
      </div>
    </Wrapper>
  )
}

export default ApproveTransactionStep
