import React from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const TxBlock = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
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

  const { from } = txDetails // add in later
  const { to } = txDetails // add in later
  const amount = txDetails.value
  const { gas } = txDetails
  const { gasPrice } = txDetails
  const message = txDetails.data

  return (
    <Wrapper>
      <div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            marginBottom: '1rem'
          }}
        >
          <img
            alt='Dapp Logo'
            height='50px'
            width='auto'
            src={sessionDetails.peerMeta.icons[0]}
            style={{ marginRight: '15px' }}
          />
          <Text weight={600} color='grey900' size='20px'>
            Signature Request
          </Text>
        </div>
        <div>
          <hr />
          <TxBlock>
            <Text weight={500} color='grey900' size='16px'>
              From:
            </Text>
            <Text weight={500} color='grey900' size='16px'>
              ETH Private Wallet
            </Text>
          </TxBlock>
          <hr />
          <TxBlock>
            <Text weight={500} color='grey900' size='16px'>
              To:
            </Text>
            <Text weight={500} color='grey900' size='16px'>
              {sessionDetails.peerMeta.name}
            </Text>
          </TxBlock>
          <hr />
          <TxBlock>
            <Text weight={500} color='grey900' size='16px'>
              Amount:
            </Text>
            <Text weight={500} color='grey900' size='16px'>
              {amount}
            </Text>
          </TxBlock>
          <hr />
          <TxBlock>
            <Text weight={500} color='grey900' size='16px'>
              Gas
            </Text>
            <Text weight={500} color='grey900' size='16px'>
              {gas}
            </Text>
          </TxBlock>
          <hr />
          <TxBlock>
            <Text weight={500} color='grey900' size='16px'>
              Gas Price:
            </Text>
            <Text weight={500} color='grey900' size='16px'>
              {gasPrice}
            </Text>
          </TxBlock>
          <hr />
          <div>
            <Text weight={500} color='grey900' size='16px'>
              Message from {sessionDetails.peerMeta.name}
            </Text>
            <Text weight={500} color='grey600' size='14px' style={{ marginTop: '10px' }}>
              {message}
            </Text>
          </div>
        </div>
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
