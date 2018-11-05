import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Image, Text } from 'blockchain-info-components'
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
  flex-direction: column-reverse;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  @media (min-width: 1200px) {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
  }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 15px;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    height: 100%;
    width: ${props => props.width || 'auto'};
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 15px;
  flex-wrap: wrap;

  & > :not(:last-child) {
    margin-right: 10px;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    min-height: 100%;
    margin-bottom: ${props => props.marginBottom};
  }
`
const PreviewImage = styled(Image).attrs({
  name: 'kyc-get-started'
})`
  width: 410px;
  @media (max-width: 1200px) {
    width: 350px;
  }
`
const DarkText = styled(Text).attrs({
  color: 'gray-5',
  size: '16px',
  weight: 300
})`
  @media (max-width: 1200px) {
    display: ${props => (props.hideOnMobile ? 'none' : 'inline-block')};
  }
`
const PrimaryText = styled(Text).attrs({
  color: 'brand-primary',
  size: '16px'
})`
  white-space: nowrap;
`

export const GetStarted = () => (
  <Wrapper>
    <Container>
      <Column>
        <Row marginBottom='36px'>
          <Text color='brand-primary' size='30px' weight={600}>
            <FormattedMessage
              defaultMessage='A better way to trade crypto'
              id='scenes.exchange.getstarted.title'
            />
          </Text>
        </Row>
        <Row marginBottom='24px'>
          <DarkText>
            <FormattedMessage
              defaultMessage='The faster, smarter way to trade your crypto.'
              id='scenes.exchange.getstarted.introducing'
            />
          </DarkText>
        </Row>
        <Row marginBottom='8px'>
          <DarkText>
            <FormattedMessage
              defaultMessage='Upgrade now to enjoy the following benefits:'
              id='scenes.exchange.getstarted.upgrade'
            />
          </DarkText>
        </Row>
        <Row marginBottom='8px'>
          <PrimaryText>
            <FormattedMessage
              defaultMessage='Lower cost'
              id='scenes.exchange.getstarted.lowercost'
            />
          </PrimaryText>
          <DarkText hideOnMobile>{' - '}</DarkText>
          <DarkText>
            <FormattedMessage
              defaultMessage='Super competitive crypto exchange prices'
              id='scenes.exchange.getstarted.lowercost_description'
            />
          </DarkText>
        </Row>
        <Row marginBottom='8px'>
          <PrimaryText>
            <FormattedMessage
              defaultMessage='Live rates'
              id='scenes.exchange.getstarted.liverates'
            />
          </PrimaryText>
          <DarkText hideOnMobile>{' - '}</DarkText>
          <DarkText>
            <FormattedMessage
              defaultMessage='You always get the most up to date price'
              id='scenes.exchange.getstarted.liverates_Description'
            />
          </DarkText>
        </Row>
        <Row marginBottom='32px'>
          <PrimaryText>
            <FormattedMessage
              defaultMessage='Higher limits'
              id='scenes.exchange.getstarted.higherlimits'
            />
          </PrimaryText>
          <DarkText hideOnMobile>{' - '}</DarkText>
          <DarkText>
            <FormattedMessage
              defaultMessage='Limits from $2,000-$10,000'
              id='scenes.exchange.getstarted.higherlimits_description'
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
