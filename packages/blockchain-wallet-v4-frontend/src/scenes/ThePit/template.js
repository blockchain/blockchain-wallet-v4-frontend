import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import media from 'services/ResponsiveService'
import {
  Button,
  Image,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 50px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto 25px;
  width: 660px;
  ${media.tablet`
    flex-direction: column;
    width: 90%;
  `};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 46px;
  &:last-child {
    margin-top: 32px;
  }
  ${media.tablet`
    flex-direction: column;
  `};
`
const Content = styled(Text)`
  margin: 15px 0 20px 0;
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
`

const StarfieldText = styled(Text)`
  margin: 0 35px;
  color: white;
  text-align: center;
  line-height: 1.4;
  z-index: 1;
  max-width: 226px;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`

const FooterColumn = styled(Column)`
  padding-left: 25px;
  ${media.tablet`
    padding-left: 0;
  `}
`

const StarfieldColumn = styled(Column)`
  background-image: url('/img/starfield2.png');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 15px;
  ${media.tablet`
    padding: 20px 0;
  `}
`
const SubTextGroup = styled(TextGroup)`
  padding-right: 25px;
  ${media.tablet`
    padding-right: 10px;
  `};
`

const ThirdSubTextGroup = styled(TextGroup)`
  margin-right: 0px;
`

const TitleTextGroup = styled(TextGroup)`
  padding-right: 30px;
  ${media.tablet`
    padding-right: 4px;
  `};
`

const StarfieldTextGroup = styled(TextGroup)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FooterButton = styled(Button)`
  height: 56px;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
`
const FooterLink = styled(Link)`
  width: 100%;
`
const PitLogo = styled(Image)`
  margin-bottom: 10px;
  filter: invert(0);
  height: 40px;
`

const ThePit = props => {
  const { onSignup } = props
  return (
    <Wrapper>
      <Container>
        <Row>
          <Column>
            <TitleTextGroup>
              <TitleContent size='40px' weight={800} color='brand-primary'>
                <FormattedMessage
                  id='scenes.thepit.title'
                  defaultMessage='Level Up Your Trading'
                />
              </TitleContent>
              <Content weight={500} size='16px'>
                <FormattedMessage
                  id='scenes.thepit.subtitle1'
                  defaultMessage='We built the fastest exchange in crypto to re-define the speed, reliability, and liquidity crypto investors should not only expect, but demand.'
                />
              </Content>
            </TitleTextGroup>
          </Column>
          <StarfieldColumn>
            <StarfieldTextGroup>
              <PitLogo name='the-pit-text' />
              <StarfieldText weight={600}>
                <FormattedMessage
                  id='scenes.thepit.image.subtitle'
                  defaultMessage='The only Exchange that connects to your Wallet.'
                />
              </StarfieldText>
            </StarfieldTextGroup>
          </StarfieldColumn>
        </Row>
        <Row>
          <SubTextGroup>
            <SubContent size='15px' weight={550} color='brand-primary'>
              <FormattedMessage
                id='scenes.thepit.point1.title'
                defaultMessage='Fast and Liquid'
              />
            </SubContent>
            <SubContent size='14px' weight={500}>
              <FormattedMessage
                id='scenes.thepit.point1.subtitle1'
                defaultMessage='Trade in microseconds with the fastest matching engine in crypto and deep pool of institutional liquidity.'
              />
            </SubContent>
          </SubTextGroup>
          <SubTextGroup>
            <SubContent size='15px' weight={550} color='brand-primary'>
              <FormattedMessage
                id='scenes.thepit.point2.title'
                defaultMessage='Easy to Use'
              />
            </SubContent>
            <SubContent size='14px' weight={500}>
              <FormattedMessage
                id='scenes.thepit.point2.subtitle1'
                defaultMessage='No instructional manual required! The PIT makes it refreshingly easy for you to use Wall Street quality tech.'
              />
            </SubContent>
          </SubTextGroup>
          <ThirdSubTextGroup>
            <SubContent size='15px' weight={550} color='brand-primary'>
              <FormattedMessage
                id='scenes.thepit.point3.title'
                defaultMessage='Blockchain Connect'
              />
            </SubContent>
            <SubContent size='14px' weight={500}>
              <FormattedMessage
                id='scenes.thepit.point3.subtitle1'
                defaultMessage='The only exchange with a seamless, secure integration to your digital Blockchain Wallet.'
              />
            </SubContent>
          </ThirdSubTextGroup>
        </Row>
        <Row>
          <Column style={{ paddingRight: '25px' }}>
            <FooterButton nature='primary' fullwidth onClick={onSignup}>
              <FormattedMessage
                id='scenes.thepit.connectnow'
                defaultMessage='Connect Now'
              />
            </FooterButton>
          </Column>
          <FooterColumn>
            <FooterLink
              href='https://pit.blockchain.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FooterButton nature='empty-secondary' fullwidth>
                <FormattedMessage
                  id='scenes.thepit.learnmore'
                  defaultMessage='Learn More'
                />
              </FooterButton>
            </FooterLink>
          </FooterColumn>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default ThePit
