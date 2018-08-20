import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { FlatLoader, TextGroup, Text } from 'blockchain-info-components'

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
`

const Loading = props => {
  return (
    <React.Fragment>
      <TextGroup>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.connectdevice.step1'
            defaultMessage='1. Connect your lockbox to computer via USB port.'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.connectdevice.step2'
            defaultMessage='2. Press both buttons on your device to begin setup.'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='modals.lockboxsetup.connectdevice.step3'
            defaultMessage='3. Setup your pin and complete your backup phrase process.'
          />
        </Text>
      </TextGroup>
      <LoaderContainer>
        <FlatLoader width='150px' height='25px' />
      </LoaderContainer>
    </React.Fragment>
  )
}

export default Loading
