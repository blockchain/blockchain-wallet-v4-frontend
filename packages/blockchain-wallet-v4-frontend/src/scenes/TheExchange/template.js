import { Button, Text, TextGroup } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { SceneWrapper } from 'components/Layout'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 666px;
  ${media.tablet`
    flex-direction: column;
    width: 90%;
  `};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  &:first-child {
    align-items: flex-end;
  }
  &:last-child {
    margin-top: 35px;
  }
  ${media.tablet`
    flex-direction: column;
  `};
`
const Content = styled(Text)`
  margin: 15px 0 0 0;
  line-height: 1.4;
`

const TitleContent = styled(Text)`
  padding-right: 40px;
  margin-bottom: -8px;
  ${media.tablet`
    padding-right: 16px;
  `};
`

const SubContent = styled(Text)`
  margin: 8px 0 -1px 0;
  line-height: 1.4;
  max-width: 202px;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  &:first-child {
    justify-content: flex-end;
  }
`

const SubTextGroup = styled(TextGroup)`
  padding-right: 30px;
  ${media.tablet`
    padding-right: 10px;
  `};
`

const ThirdSubTextGroup = styled(TextGroup)`
  margin-right: 0px;
`

const TitleTextGroup = styled(TextGroup)`
  padding-right: 40px;
  ${media.tablet`
    padding-right: 4px;
  `};
`

const FooterButton = styled(Button)`
  height: 56px;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
`

const Exchange = ({ onSignup }) => (
  <SceneWrapper centerContent>
    <Container>
      <Row>
        <Column>
          <TitleTextGroup>
            <TitleContent size='40px' weight={800} color='blue900'>
              <FormattedMessage
                id='scenes.exchange.title'
                defaultMessage='Level Up Your Trading'
              />
            </TitleContent>
            <Content weight={500} size='16px'>
              <FormattedMessage
                id='scenes.exchange.subtitle1-1'
                defaultMessage='We built our own exchange that redefines speed, reliability, and liquidity so you can upgrade your trading experience.'
              />
            </Content>
          </TitleTextGroup>
        </Column>
      </Row>
      <Row>
        <SubTextGroup>
          <SubContent size='15px' weight={550} color='blue900'>
            <FormattedMessage
              id='scenes.exchange.point1.title-1'
              defaultMessage='Access More Assets'
            />
          </SubContent>
          <SubContent size='14px' weight={500}>
            <FormattedMessage
              id='scenes.exchange.point1.subtitle1-1'
              defaultMessage='Expand your crypto portfolio. Easily deposit and withdraw dollars, euros, and trade top cryptos. Also gain access to exclusive and emerging digital assets.'
            />
          </SubContent>
        </SubTextGroup>
        <SubTextGroup>
          <SubContent size='15px' weight={550} color='blue900'>
            <FormattedMessage
              id='scenes.exchange.point2.title-1'
              defaultMessage='Unlock Unlimited Trading'
            />
          </SubContent>
          <SubContent size='14px' weight={500}>
            <FormattedMessage
              id='scenes.exchange.point2.subtitle1-2'
              defaultMessage='Already Verified? Share your Gold or Silver status to begin trading on the Exchange immediately.'
            />
          </SubContent>
        </SubTextGroup>
        <ThirdSubTextGroup>
          <SubContent size='15px' weight={550} color='blue900'>
            <FormattedMessage
              id='scenes.exchange.point3.title-1'
              defaultMessage='Seamlessly Transfer Crypto'
            />
          </SubContent>
          <SubContent size='14px' weight={500}>
            <FormattedMessage
              id='scenes.exchange.point3.subtitle1-2'
              defaultMessage="Link your Wallet to the Exchange to easily sweep crypto back and forth. No copy pasting or typos. It's the most secure way to trade while keeping your keys."
            />
          </SubContent>
        </ThirdSubTextGroup>
      </Row>
      <Row>
        <Column>
          <FooterButton nature='primary' fullwidth onClick={onSignup}>
            <FormattedMessage
              id='scenes.exchange.connectnow'
              defaultMessage='Connect Now'
            />
          </FooterButton>
        </Column>
      </Row>
    </Container>
  </SceneWrapper>
)

export default Exchange
