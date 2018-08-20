import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text, TextGroup, FlatLoader } from 'blockchain-info-components'

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
`

const OpenBtcAppStep = props => {
  return (
    <React.Fragment>
      <TextGroup>
        <Text size='18px' weight={500}>
          <FormattedMessage
            id='modals.lockboxsetup.openbtcappstep.title'
            defaultMessage='Sync Your Device With Your Wallet'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.openbtcappstep.explanation'
            defaultMessage='Open the Bitcoin application to complete the synchronization with your web wallet.'
          />
        </Text>
      </TextGroup>
      <LoaderContainer>
        <FlatLoader width='150px' height='25px' />
      </LoaderContainer>
    </React.Fragment>
  )
}

export default OpenBtcAppStep
