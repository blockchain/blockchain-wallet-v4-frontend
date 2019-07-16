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
  width: 630px;
  ${media.tablet`
    flex-direction: column;
    width: 90%;
  `};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  &:last-child {
    margin-top: 32px;
  }
`
const Content = styled(Text)`
  margin: 15px 0 20px 0;
  line-height: 1.4;
`
const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`
const SubTextGroup = styled(TextGroup)`
  padding-right: 30px;
  ${media.tablet`
    padding-right: 12px;
  `};
`
const FooterButton = styled(Button)`
  height: 56px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
`
const FooterLink = styled(Link)`
  width: 100%;
`
const PitLogo = styled(Image)`
  margin-bottom: 5px;
  filter: invert(0.78);
`

const ThePit = props => {
  const { onSignup } = props
  return (
    <Wrapper>
      <Container>
        <Row>
          <Column>
            <PitLogo name='the-pit-word' height='64px' />
          </Column>
          <Column>
            <Content weight={400}>
              <FormattedMessage
                id='scenes.thepit.subtitle'
                defaultMessage='Level up to our new exchange for unlimited trading in the most desired crypto pairs.'
              />
            </Content>
          </Column>
        </Row>
        <Row>
          <SubTextGroup>
            <Text size='15px' weight={500} color='brand-primary'>
              <FormattedMessage
                id='scenes.thepit.point1.title'
                defaultMessage='Fast and Liquid'
              />
            </Text>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='scenes.thepit.point1.subtitle'
                defaultMessage='We combined an ultra fast matching engine with deep liquidity so you can react quickly and with precision.'
              />
            </Text>
          </SubTextGroup>
          <SubTextGroup>
            <Text size='15px' weight={500} color='brand-primary'>
              <FormattedMessage
                id='scenes.thepit.point2.title'
                defaultMessage='Easy to Use'
              />
            </Text>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='scenes.thepit.point2.subtitle'
                defaultMessage='No instructional manual required!  The PIT is refreshingly simple, fun, and lightning fast.'
              />
            </Text>
          </SubTextGroup>
          <SubTextGroup>
            <Text size='15px' weight={500} color='brand-primary'>
              <FormattedMessage
                id='scenes.thepit.point3.title'
                defaultMessage='Blockchain Connect'
              />
            </Text>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='scenes.thepit.point3.subtitle'
                defaultMessage='The only exchange seamlessly integrated with your secure digital wallet.
'
              />
            </Text>
          </SubTextGroup>
        </Row>
        <Row>
          <Column style={{ paddingRight: '25px' }}>
            <FooterButton nature='primary' fullwidth onClick={onSignup}>
              <FormattedMessage
                id='scenes.thepit.signup'
                defaultMessage='Sign Up'
              />
            </FooterButton>
          </Column>
          <Column style={{ paddingLeft: '25px' }}>
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
          </Column>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default ThePit
