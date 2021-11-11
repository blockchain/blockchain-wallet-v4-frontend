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

const ApproveTransactionStep = (props) => {
  const { data: requestDetails, sessionDetails } = props
  const txDetails = requestDetails.params[0]
  console.log('approve this tx step!!!', requestDetails)
  const approveRequest = () => {
    props.walletConnectActions.respondToTxSendRequest({ action: 'APPROVE', requestDetails })
  }
  const rejectRequest = () => {
    props.walletConnectActions.respondToTxSendRequest({ action: 'REJECT', requestDetails })
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
      <Text weight={600} color='grey600' size='20px' style={{ marginBottom: '1.5rem' }}>
        {sessionDetails.peerMeta.name} Transaction Request
      </Text>
      <Text weight={800} color='grey600' size='16px' style={{ marginBottom: '0.5rem' }}>
        Transaction Details
      </Text>
      <Text weight={600} color='grey600' size='12px' style={{ marginBottom: '3.5rem' }}>
        <pre>{JSON.stringify(txDetails, null, 2)}</pre>
      </Text>
      <Button
        fullwidth
        height='48px'
        data-e2e='acceptTransaction'
        nature='primary'
        size='16px'
        style={{ marginBottom: '1rem' }}
        onClick={approveRequest}
      >
        Approve Transaction
      </Button>
      <Button
        fullwidth
        height='48px'
        data-e2e='rejectTransaction'
        nature='warning'
        size='16px'
        onClick={rejectRequest}
      >
        Reject Transaction
      </Button>
    </Wrapper>
  )
}

export default ApproveTransactionStep
