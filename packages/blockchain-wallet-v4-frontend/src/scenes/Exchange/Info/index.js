import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 0px 30px 30px 30px;
`

export default () => (
  <Wrapper>
    <Text size='18px' weight={600} color='brand-primary'>
      <FormattedMessage
        id='scenes.exchange.simple'
        defaultMessage='Simple. Seamless. Secure.'
      />
    </Text>
    <TextGroup inline>
      <Text size='13px' weight={300}>
        <FormattedMessage
          id='scenes.exchange.summary'
          defaultMessage='You can exchange between bitcoin, ether, and bitcoin cash directly from your Blockchain wallet.'
        />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage
          id='scenes.exchange.summary2'
          defaultMessage='In a few simple steps, your exchange will be in progress.'
        />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage
          id='scenes.exchange.summary3'
          defaultMessage='Note: exchanges usually take between twenty minutes and two hours.'
        />
      </Text>
      <TextGroup inline>
        <Text weight={300} size='13px'>
          <FormattedMessage
            id='scenes.exchange.help'
            defaultMessage='Need help?'
          />
        </Text>
        <Link
          href='https://support.blockchain.com/hc/en-us/requests/new'
          target='_blank'
          size='13px'
          weight={300}
        >
          <FormattedMessage
            id='scenes.exchange.support'
            defaultMessage='Contact Support'
          />
        </Link>
      </TextGroup>
    </TextGroup>
  </Wrapper>
)
