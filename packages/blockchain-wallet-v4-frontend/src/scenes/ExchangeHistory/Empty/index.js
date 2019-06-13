import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import {
  Icon,
  Link,
  Separator,
  Text,
  TextGroup
} from 'blockchain-info-components'

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
  align-items: center;
  margin: 50px 10px 0 10px;
`
const ExchangeIcon = styled(Icon)`
  justify-content: center;
`

const CenteredTextGroup = styled(TextGroup)`
  text-align: center;
`

const Empty = () => (
  <Wrapper>
    <Transactions>
      <Text size='24px' weight={400} capitalize>
        <ExchangeIcon name='thick-arrow-switch' size='24px' />
        <FormattedMessage
          id='scenes.exchangehistory.empty.history'
          defaultMessage='Your order history'
        />
      </Text>
      <CenteredTextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage
            id='scenes.exchangehistory.empty.swap'
            defaultMessage="You haven't swapped yet,"
          />
        </Text>
        <LinkContainer to='/swap'>
          <Link size='13px' weight={500}>
            <FormattedMessage
              id='scenes.exchangehistory.empty.start'
              defaultMessage='click here to start.'
            />
          </Link>
        </LinkContainer>
      </CenteredTextGroup>
      <Separator />
    </Transactions>
  </Wrapper>
)

export default Empty
