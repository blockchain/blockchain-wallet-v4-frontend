import {
  Button,
  Image,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { model } from 'data'
import media from 'services/ResponsiveService'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto 25px;
  width: 640px;
  > :last-child {
    margin-top: 48px;
  }
  ${media.tablet`
    flex-direction: column;
    width: 100%;
  `};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
`
const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`
const FooterButton = styled(Button)`
  height: 54px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
`
const SubTextGroup = styled(TextGroup)`
  padding-right: 30px;
  ${media.tablet`
    padding-right: 12px;
  `};
`

const WelcomePax = props => {
  const { availability, handleRequest, currentUserTier } = props
  return (
    <Container>
      <Row>
        <Column>
          <div>
            <Text size='24px' weight={500} color='blue900'>
              <FormattedMessage
                id='scenes.transaction.content.empty.pax.title1'
                defaultMessage='A Digital US Dollar in'
              />
            </Text>
            <Text size='24px' weight={500} color='blue900'>
              <FormattedMessage
                id='scenes.transaction.content.empty.pax.title2'
                defaultMessage='Your Wallet'
              />
            </Text>
            <Text weight={400} style={{ marginTop: '16px' }}>
              <FormattedMessage
                id='scenes.transaction.content.empty.pax.subtitle2'
                defaultMessage='USD Pax is a crypto asset 100% backed by funds held in regulated US banks. 1 PAX equals 1 US Dollar.'
              />
            </Text>
          </div>
        </Column>
        <Column>
          <Image width='90%' name='coin-pax' />
        </Column>
      </Row>
      <Row>
        <SubTextGroup inline>
          <Text size='14px' weight={500} color='blue900'>
            <FormattedMessage
              id='scenes.transaction.content.empty.pax.fact1.1'
              defaultMessage='Store Value'
            />
          </Text>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='scenes.transaction.content.empty.pax.fact1.2'
              defaultMessage='in a stable, USD-backed account.'
            />
          </Text>
        </SubTextGroup>
        <SubTextGroup inline>
          <Text size='14px' weight={500} color='blue900'>
            <FormattedMessage
              id='scenes.transaction.content.empty.pax.fact2.1'
              defaultMessage='Send'
            />
          </Text>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='scenes.transaction.content.empty.pax.fact2.2'
              defaultMessage='to anyone in the world — anywhere, anytime.'
            />
          </Text>
        </SubTextGroup>
        <SubTextGroup inline>
          <Text size='14px' weight={500} color='blue900'>
            <FormattedMessage
              id='scenes.transaction.content.empty.pax.fact3.1'
              defaultMessage='Trade'
            />
          </Text>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='scenes.transaction.content.empty.pax.fact3.2'
              defaultMessage='into other cryptos and manage risk.'
            />
          </Text>
        </SubTextGroup>
      </Row>
      <Row>
        <Column style={{ paddingRight: '20px' }}>
          {currentUserTier && currentUserTier.current === 2 ? (
            <LinkContainer
              to={{
                pathname: '/swap',
                state: {
                  from: 'BTC',
                  to: 'PAX',
                  amount: '0',
                  fix: model.rates.FIX_TYPES.BASE_IN_FIAT
                }
              }}
            >
              <FooterButton nature='primary' onClick={handleRequest} fullwidth>
                <FormattedMessage
                  id='scenes.transaction.content.empty.pax.swapcta'
                  defaultMessage='Swap for USD PAX Now'
                />
              </FooterButton>
            </LinkContainer>
          ) : (
            <LinkContainer to={'/swap/profile'}>
              <FooterButton nature='primary' onClick={handleRequest} fullwidth>
                <FormattedMessage
                  id='scenes.transaction.content.empty.pax.signupcta'
                  defaultMessage='Swap for USD PAX Now'
                />
              </FooterButton>
            </LinkContainer>
          )}
        </Column>
        <Column style={{ paddingLeft: '20px' }}>
          <Link
            href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
            target='_blank'
            style={{ width: '100%' }}
          >
            <FooterButton
              nature='empty-secondary'
              fullwidth
              disabled={!availability.exchange}
            >
              <FormattedMessage
                id='scenes.transaction.content.empty.getstarted.learnmore'
                defaultMessage='Learn More'
              />
            </FooterButton>
          </Link>
        </Column>
      </Row>
    </Container>
  )
}

WelcomePax.propTypes = {
  availability: PropTypes.object.isRequired,
  currentCoin: PropTypes.object.isRequired,
  currentUserTier: PropTypes.object.isRequired
}

export default WelcomePax
