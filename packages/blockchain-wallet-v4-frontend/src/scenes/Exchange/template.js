import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text, TextGroup } from 'blockchain-info-components'
import ExchangeLayout from 'layouts/Exchange'
import ExchangeBox from './ExchangeBox'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  @media(min-width: 992px) { flex-direction: row; }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const ColumnLeft = styled(Column)`
  align-items: flex-end;
  order: 2;
  margin-right: 10px;

  & > :first-child { margin-bottom: 10px; }
  @media(min-width: 992px) {
    order: 1;
    width: 60%;
  }
`
const ColumnRight = styled(Column)`
  order: 1;
  padding: 0;
  margin-bottom: 10px;
  box-sizing: border-box;

  @media(min-width: 992px) {
    order: 2;
    width: 40%;
    padding: 0 30px 20px 30px;
  }
`
const Exchange = () => {
  return (
    <ExchangeLayout>
      <Wrapper>
        <ColumnLeft>
          <ExchangeBox>
            <FormattedMessage id='scenes.Exchange details' defaultMessage='Exchange details' />
          </ExchangeBox>
          <TextGroup inline>
            <Text weight={300} size='13px'>
              <FormattedMessage id='scenes.exchange.simple' defaultMessage='Need help?' />
            </Text>
            <Link href='https://support.blockchain.com/hc/en-us/requests/new' target='_blank' size='13px' weight={300}>
              <FormattedMessage id='scenes.exchange.support' defaultMessage='Contact Support' />
            </Link>
          </TextGroup>
        </ColumnLeft>
        <ColumnRight>
          <TextGroup>
            <Text size='18px' weight={600} color='brand-primary' >
              <FormattedMessage id='scenes.exchange.simple' defaultMessage='Simple. Seamless. Secure.' />
            </Text>
            <Text size='13px' weight={300}>
              <FormattedMessage id='scenes.exchange.summary' defaultMessage='You can now exchange your bitcoin for ether and vice versa directly from your Blockchain wallet. In a few simple steps, your exchange will be in progress. Note: exchanges usually take between twenty minutes and two hours.' />
            </Text>
          </TextGroup>
        </ColumnRight>
      </Wrapper>
    </ExchangeLayout>
  )
}

export default Exchange
