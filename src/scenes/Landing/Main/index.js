import React from 'react'
import styled from 'styled-components'

import { Grid, Text } from 'blockchain-components'
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
const BannerContainer = styled(Grid)``
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
          <Text id='scenes.landing.main.simple' text='Simple. Seamless. Secure.' gianter lighter white />
          <Text id='scenes.landing.main.popular' text="Blockchain is the world's most popular bitcoin wallet." light white />
          <Text id='scenes.landing.main.mission' text='We are on a mission to build a more open, accessible, and fair financial future, one piece of software at a time.' light white />
          <Text id='scenes.landing.main.getstarted' text='Get started now' cyan />
        </BannerContainer>
      </BannerWrapper>
      <BlockContainer>
        <Block1>
          <Text id='scenes.landing.main.bitcoin' text='#1 Bitcoin wallet' biggest light white uppercase />
        </Block1>
        <Block2>
          <Text id='scenes.landing.main.transactions' text='{nbTransactions} million+ transactions' values={{nbTransactions: '100'}} biggest light white uppercase />
        </Block2>
        <Block3>
          <Text id='scenes.landing.main.wallets' text='{nbWallets} million+ wallets' values={{nbWallets: '14'}} biggest light white uppercase />
        </Block3>
      </BlockContainer>
    </MainContainer>
  )
}

export default Main
