import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`

export default () => (
  <Wrapper>
    <Text size='18px' weight={600} color='brand-primary' >
      <FormattedMessage id='scenes.exchange.simple' defaultMessage='Simple. Seamless. Secure.' />
    </Text>
    <TextGroup inline>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.exchange.summary' defaultMessage='You can exchange between bitcoin, ether, and bitcoin cash directly from your Blockchain wallet.' />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.exchange.summary2' defaultMessage='In a few simple steps, your exchange will be in progress.' />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.exchange.summary3' defaultMessage='Note: exchanges usually take between twenty minutes and two hours.' />
      </Text>
    </TextGroup>
  </Wrapper>
)
