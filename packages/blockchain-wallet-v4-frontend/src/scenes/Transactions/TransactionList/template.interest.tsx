import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 50px auto 0;
  width: 640px;
  ${media.tablet`
    flex-direction: column;
    width: 100%;
  `};
`
const Content = styled(Text)`
  margin: 15px 0 20px 0;
  line-height: 1.4;
`
const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const InterestTransactions: React.FC<Props> = () => {
  return (
    <Container>
      <Column>
        <div>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.interest.interestaccount'
              defaultMessage='Interest Account'
            />
          </Text>
          <Content weight={400}>
            <FormattedMessage
              id='scenes.transaction.interest.view_txs'
              defaultMessage='Visit the Earn Interest page to view your transaction history.'
            />
          </Content>
        </div>
      </Column>
      <Column>
        <NavLink
          style={{ textDecoration: 'none' }}
          to='/interest/history'
          data-e2e='visitEarnInterestPage'
        >
          <Button
            data-e2e='viewInterestTransaction'
            nature='primary'
            height='48px'
            size='16px'
          >
            <FormattedMessage
              id='copy.viewTransactions'
              defaultMessage='View Transactions'
            />
          </Button>
        </NavLink>
      </Column>
    </Container>
  )
}

type Props = {}

export default InterestTransactions
