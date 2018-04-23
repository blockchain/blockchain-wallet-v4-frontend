import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Icon, Link, Separator, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Transactions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items : center;
  margin-top: 100px;
`
const ExchangeIcon = styled(Icon)`
  justify-content: center;
`

const Empty = () => (
  <Wrapper>
    <Transactions>
      <Text size='24px' weight={200} capitalize>
        <ExchangeIcon name='exchange' size='24px' />
        <FormattedMessage id='scenes.exchangehistory.empty.history' defaultMessage='Your order history' />
      </Text>
      <TextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage id='scenes.exchangehistory.empty.exchange' defaultMessage="You haven't made any exchanges yet," />
        </Text>
        <LinkContainer to='/exchange'>
          <Link size='13px' weight={500}>
            <FormattedMessage id='scenes.exchangehistory.empty.start' defaultMessage='click here to start.' />
          </Link>
        </LinkContainer>
      </TextGroup>
      <Separator />
    </Transactions>
  </Wrapper>
)

export default Empty
