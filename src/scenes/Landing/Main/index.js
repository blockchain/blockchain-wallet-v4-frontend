import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Grid } from 'react-bootstrap'

import banner from 'img/landing-page-banner-overlay.jpg'

const MainContainer = styled.div``
const BannerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 480px;
  background: url(${banner});
  background-size: cover;
`
const BannerContainer = styled(Grid)`
  color: #FFFFFF;
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
  text-align: center;
  color: #FFFFFF;
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
      <BannerWrapper>
        <BannerContainer>
          <FormattedMessage id='scenes.landing.main.simple' defaultMessage='Simple. Seamless. Secure.' />
          <FormattedMessage id='scenes.landing.main.popular' defaultMessage="Blockchain is the world's most popular bitcoin wallet." />
          <FormattedMessage id='scenes.landing.main.mission' defaultMessage='We are on a mission to build a more open, accessible, and fair financial future, one piece of software at a time.' />
          <FormattedMessage id='scenes.landing.main.getstarted' defaultMessage='Get started now' />
        </BannerContainer>
      </BannerWrapper>
      <BlockContainer>
        <Block1>
          <FormattedMessage id='scenes.landing.main.bitcoin' defaultMessage='#1 Bitcoin wallet' />
        </Block1>
        <Block2>
          <FormattedMessage id='scenes.landing.main.transactions' defaultMessage='{nbTransactions} million+ transactions' values={{nbTransactions: '100'}} />
        </Block2>
        <Block3>
          <FormattedMessage id='scenes.landing.main.wallets' defaultMessage='{nbWallets} million+ wallets' values={{nbWallets: '14'}} />
        </Block3>
      </BlockContainer>
    </MainContainer>
  )
}

export default Main
