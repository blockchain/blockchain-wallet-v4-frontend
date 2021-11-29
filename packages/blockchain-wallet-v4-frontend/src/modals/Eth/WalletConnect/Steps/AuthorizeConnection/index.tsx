import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
`
const ButtonGroup = styled.div`
  margin-bottom: 96px;
  width: 100%;
`
const DappInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const AuthorizeConnectionStep = (props) => {
  const { data: sessionDetails, uri, walletConnectActions } = props

  const approveRequest = () => {
    walletConnectActions.respondToSessionRequest({ action: 'APPROVE', sessionDetails, uri })
  }
  const rejectRequest = () => {
    walletConnectActions.respondToSessionRequest({ action: 'REJECT', sessionDetails, uri })
  }

  return (
    <Wrapper>
      <DappInfo>
        <img
          alt='Dapp Logo'
          height='100px'
          width='auto'
          style={{ marginBottom: '0.5rem' }}
          src={sessionDetails.peerMeta.icons[0]}
        />
        <Text weight={600} color='grey900' size='20px' style={{ marginBottom: '1rem' }}>
          <FormattedMessage
            id='scenes.walletconnect.session_request'
            defaultMessage='{dapp} wants to connect to your wallet.'
            values={{
              dapp: sessionDetails.peerMeta.name
            }}
          />
        </Text>
        <Text weight={500} color='grey600' size='14px' style={{ marginBottom: '0.5rem' }}>
          {sessionDetails.peerMeta.url}
        </Text>
      </DappInfo>
      <ButtonGroup>
        <Button
          fullwidth
          height='48px'
          data-e2e='rejectConnection'
          nature='light-red'
          size='16px'
          style={{ marginBottom: '1rem' }}
          onClick={rejectRequest}
        >
          <FormattedMessage id='copy.deny' defaultMessage='Deny' />
        </Button>
        <Button
          fullwidth
          height='48px'
          data-e2e='acceptConnection'
          nature='primary'
          size='16px'
          onClick={approveRequest}
        >
          <FormattedMessage id='copy.approve' defaultMessage='Approve' />
        </Button>
      </ButtonGroup>
    </Wrapper>
  )
}

export default AuthorizeConnectionStep
