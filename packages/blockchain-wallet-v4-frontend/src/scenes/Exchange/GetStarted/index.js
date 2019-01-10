import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Image, Text, Media } from 'blockchain-info-components'
import StatusBar from './StatusBar'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 50px;
  box-sizing: border-box;
`
const Container = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: auto;
  flex-direction: row;
  justify-content: center;

  ${Media.laptop`
    flex-direction: column-reverse;
    justify-content: center;
  `};
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 15px;
  box-sizing: border-box;
  width: ${props => props.width || 'auto'};
  ${Media.laptop`
    width: 100%;
  `};
`
const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  min-height: 100%;
  margin-bottom: ${props => props.marginBottom || 'none'};
  & > :not(:last-child) {
    margin-right: 10px;
  }
  ${Media.laptop`
    flex-direction: column;
    margin-bottom: 15px;
  `};
`
const PreviewImage = styled(Image).attrs({
  name: 'kyc-get-started'
})`
  width: 410px;
  ${Media.laptop`
    width: 350px;
  `};
`
const DarkText = styled(Text).attrs({
  color: 'gray-5',
  size: '16px',
  weight: 300
})`
  display: inline;
  @media (max-width: 1200px) {
    display: ${props => (props.hideOnMobile ? 'none' : 'inline')};
  }
`
const PrimaryText = styled(Text).attrs({
  color: 'brand-primary',
  size: '16px'
})`
  display: inline;
  white-space: nowrap;
`

export const GetStarted = () => (
  <Wrapper>
    <Container>
      <Column>
        <Row marginBottom='36px'>
          <Text color='brand-primary' size='30px' weight={600}>
            <FormattedMessage
              defaultMessage="Trading your crypto doesn't mean trading away control"
              id='scenes.exchange.getstarted.header'
            />
          </Text>
        </Row>
        <Row marginBottom='24px'>
          <DarkText>
            <FormattedMessage
              defaultMessage='Swap enables you to trade crypto with the best prices and quick settlement, all while maintaining full control of your funds.'
              id='scenes.exchange.getstarted.description'
            />
          </DarkText>
        </Row>
        <Row marginBottom='8px'>
          <DarkText>
            <PrimaryText>
              <FormattedMessage
                defaultMessage='Low Fees'
                id='scenes.exchange.getstarted.low_fees'
              />
            </PrimaryText>
            <DarkText hideOnMobile>{' - '}</DarkText>
            <FormattedMessage
              defaultMessage='Great news! Get the best prices without having to leave the security of your Wallet.'
              id='scenes.exchange.getstarted.low_fees_description'
            />
          </DarkText>
        </Row>
        <Row marginBottom='8px'>
          <DarkText>
            <PrimaryText>
              <FormattedMessage
                defaultMessage='Higher Limits'
                id='scenes.exchange.getstarted.higher_limits'
              />
            </PrimaryText>
            <DarkText hideOnMobile>{' - '}</DarkText>
            <FormattedMessage
              defaultMessage='Like to trade big? Get access to limits of up to $25,000 per day.'
              id='scenes.exchange.getstarted.higher_lits_description'
            />
          </DarkText>
        </Row>
        <Row marginBottom='32px'>
          <DarkText>
            <PrimaryText>
              <FormattedMessage
                defaultMessage='Easy to use'
                id='scenes.exchange.getstarted.easy_to_use'
              />
            </PrimaryText>
            <DarkText hideOnMobile>{' - '}</DarkText>
            <FormattedMessage
              defaultMessage='Get started in just a few steps.'
              id='scenes.exchange.getstarted.easy_to_use_description'
            />
          </DarkText>
        </Row>
        <Row>
          <StatusBar />
        </Row>
      </Column>
      <Column>
        <PreviewImage />
      </Column>
    </Container>
  </Wrapper>
)

export default GetStarted
