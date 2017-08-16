import React from 'react'
import styled from 'styled-components'

import { Grid, Text } from 'blockchain-info-components'
import Page1 from './Page1'
import Page2 from './Page2'

const BlockchainWrapper = styled.div`
  padding: 70px 0;
  background-color: #FFFFFF;
`
const BlockchainContainer = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 470px;
`
const BlockchainCarousel = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0;
`
const BlockchainCarouselContent = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 25px 0;
`
const BlockchainCarouselSlide = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
  width: 100%;
`
const BlockchainCarouselControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 30px;
`
const BlockchainCarouselControl = styled.div`
  display: flex;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.active ? '#004A7C' : '#E3EFF5'};
  cursor: pointer;
`

const WhyBlockchain = (props) => {
  return (
    <BlockchainWrapper>
      <BlockchainContainer>
        <Text id='scenes.landing.wallet.why' text='Why blockchain?' gianter lighter uppercase />
        <TextContainer>
          <Text id='scenes.landing.wallet.loved' text='Loved by Users.' light />
          <Text id='scenes.landing.wallet.praised' text='Praised by Geeks.' light />
          <Text id='scenes.landing.wallet.recognized' text='Recognized by the Press.' light />
        </TextContainer>
      </BlockchainContainer>
      <BlockchainCarousel>
        <BlockchainCarouselContent>
          <BlockchainCarouselSlide active={props.slide1}><Page1 /></BlockchainCarouselSlide>
          <BlockchainCarouselSlide active={props.slide2}><Page2 /></BlockchainCarouselSlide>
        </BlockchainCarouselContent>
        <BlockchainCarouselControls>
          <BlockchainCarouselControl active={props.slide1} onClick={props.clickPage1} />
          <BlockchainCarouselControl active={props.slide2} onClick={props.clickPage2} />
        </BlockchainCarouselControls>
      </BlockchainCarousel>
    </BlockchainWrapper>
  )
}

export default WhyBlockchain
