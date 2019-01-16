import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const DemoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  > :first-child {
    margin-right: 48px;
  }
`

const DemoHeader = () => (
  <DemoRow>
    <Text color='white' size='17px'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.demo_header.preview'
        defaultMessage='Preview'
      />
    </Text>
    <Text color='brand-primary' size='14px' weight='300'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.demo_header.demo_description'
        defaultMessage='Looking to trade your Crypto straight from your Wallet? See how Swap works.'
      />
    </Text>
  </DemoRow>
)

export default DemoHeader
