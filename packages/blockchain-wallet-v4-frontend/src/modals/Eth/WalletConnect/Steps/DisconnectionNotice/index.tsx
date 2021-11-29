import React from 'react'
import { FormattedMessage } from 'react-intl'
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
          <FormattedMessage
            id='scenes.walletconnect.session_failure'
            defaultMessage='Failed to establish or maintain a connection!'
          />
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
            <FormattedMessage
              id='scenes.walletconnect.session_ended'
              defaultMessage='Your session with {dapp} has been terminated.'
              values={{
                dapp: sessionDetails.peerMeta.name
              }}
            />
          </Text>
          <Button
            fullwidth
            height='48px'
            data-e2e='acceptConnection'
            nature='primary'
            size='16px'
            onClick={handleClose}
          >
            <FormattedMessage id='copy.close' defaultMessage='Close' />
          </Button>
        </>
      )}
    </Wrapper>
  )
}

export default DisconnectionNoticeStep
