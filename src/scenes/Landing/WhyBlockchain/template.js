import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, TextGroup } from 'blockchain-info-components'
import Container from 'components/Container'
import Page1 from './Page1'
import Page2 from './Page2'

const Wrapper = styled.div`
  padding: 70px 0;
  background-color: ${props => props.theme['white']};
`
const Row = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Carousel = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0;
`
const Content = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 25px 0;
`
const Slide = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
  width: 100%;
`
const Controls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 30px;
`
const Control = styled.div`
  display: flex;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.active ? props.theme['brand-secondary'] : props.theme['gray-4s']};
  cursor: pointer;
`

const WhyBlockchain = (props) => {
  return (
    <Wrapper>
      <Row>
        <Text size='36px' weight={300} uppercase>
          <FormattedMessage id='scenes.landing.wallet.why' defaultMessage='Why blockchain?' />
        </Text>
        <TextGroup inline>
          <Text size='16px' weight={300}>
            <FormattedMessage id='scenes.landing.wallet.loved' defaultMessage='Loved by Users.' />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage id='scenes.landing.wallet.praised' defaultMessage='Praised by Geeks.' />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage id='scenes.landing.wallet.recognized' defaultMessage='Recognized by the Press.' />
          </Text>
        </TextGroup>
      </Row>
      <Carousel>
        <Content>
          <Slide active={props.slide1}><Page1 /></Slide>
          <Slide active={props.slide2}><Page2 /></Slide>
        </Content>
        <Controls>
          <Control active={props.slide1} onClick={props.clickPage1} />
          <Control active={props.slide2} onClick={props.clickPage2} />
        </Controls>
      </Carousel>
    </Wrapper>
  )
}

export default WhyBlockchain
