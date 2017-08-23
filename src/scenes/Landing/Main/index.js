import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Grid } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { Background, Icon, Link, Text, TextGroup } from 'blockchain-info-components'

const MainContainer = styled.div``
const Wrapper = styled(Background)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 480px;
`
const Container = styled(Grid)`
  & > * { padding: 10px 0; }
`
const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media(min-width: 768px) { flex-direction: row; }
`
const Block = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
  flex-grow: 1;
`
const Block1 = Block.extend`
  background-color: #3558A8;
`
const Block2 = Block.extend`
  background-color: #004A7C;
`
const Block3 = Block.extend`
  background-color: #10ADE4;
`

const Main = (props) => {
  return (
    <MainContainer>
      <Wrapper name='landing-page-banner-overlay' height='480px'>
        <Container>
          <Text size='36px' weight={200} color='white'>
            <FormattedMessage id='scenes.landing.main.simple' defaultMessage='Simple. Seamless. Secure.' />
          </Text>
          <TextGroup inline>
            <Text size='16px' weight={300} color='white'>
              <FormattedMessage id='scenes.landing.main.popular' defaultMessage="Blockchain is the world's most popular bitcoin wallet." />
            </Text>
            <Text size='16px' weight={300} color='white'>
              <FormattedMessage id='scenes.landing.main.mission' defaultMessage='We are on a mission to build a more open, accessible, and fair financial future, one piece of software at a time.' />
            </Text>
          </TextGroup>
          <LinkContainer to='/register'>
            <Link href='https://blockchain.info/wallet/bitcoin-faq' uppercase>
              <FormattedMessage id='scenes.landing.main.getstarted' defaultMessage='Get started now' />
              <Icon name='right_arrow' color='iris' />
            </Link>
          </LinkContainer>
        </Container>
      </Wrapper>
      <BlockContainer>
        <Block1>
          <Text size='24px' weight={300} color='white' uppercase>
            <FormattedMessage id='scenes.landing.main.bitcoin' defaultMessage='#1 Bitcoin wallet' />
          </Text>
        </Block1>
        <Block2>
          <Text size='24px' weight={300} color='white' uppercase>
            <FormattedMessage id='scenes.landing.main.transactions' defaultMessage='{nbTransactions} million+ transactions' values={{ nbTransactions: '100' }} />
          </Text>
        </Block2>
        <Block3>
          <Text size='24px' weight={300} color='white' uppercase>
            <FormattedMessage id='scenes.landing.main.wallets' defaultMessage='{nbWallets} million+ wallets' values={{ nbWallets: '15' }} />
          </Text>
        </Block3>
      </BlockContainer>
    </MainContainer >
  )
}

export default Main
