import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`

export default () => (
  <Wrapper>
    <TextGroup inline>
      <Text weight={300} size='13px'>
        <FormattedMessage id='scenes.exchange.simple' defaultMessage='Need help?' />
      </Text>
      <Link href='https://support.blockchain.com/hc/en-us/requests/new' target='_blank' size='13px' weight={300}>
        <FormattedMessage id='scenes.exchange.support' defaultMessage='Contact Support' />
      </Link>
    </TextGroup>
  </Wrapper>
)
