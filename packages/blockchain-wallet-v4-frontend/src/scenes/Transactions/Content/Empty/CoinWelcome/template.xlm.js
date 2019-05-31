import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import media from 'services/ResponsiveService'
import { Button, Icon, Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding-top: 20px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto 25px;
  width: 640px;
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
  &:last-child {
    margin-top: 32px;
  }
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

const WelcomePax = props => {
  const { availability, handleRequest, currentUserTier } = props
  return (
    <Wrapper>
      <Container>
        <Row>
          <Column>
            <div>
              <Text size='24px' weight={500} color='brand-primary'>
                <FormattedMessage
                  id='scenes.transaction.content.empty.xlm.title1'
                  defaultMessage='We Now Offer'
                />
              </Text>
              <Text size='24px' weight={500} color='brand-primary'>
                <FormattedMessage
                  id='scenes.transaction.content.empty.xlm.title2'
                  defaultMessage='Stellar (XLM)'
                />
              </Text>
              <Text weight={400} style={{ marginTop: '16px' }}>
                <FormattedMessage
                  id='scenes.transaction.content.empty.xlm.subtitle2'
                  defaultMessage='XLM is a token that enables quick, low cost global transactions. Send, receive, and trade XLM from your Wallet today.'
                />
              </Text>
            </div>
          </Column>
          <Column>
            <Icon name='xlm-circle-filled' size='112px' color='xlm' />
          </Column>
        </Row>
        <Row>
          <Column style={{ paddingRight: '20px' }}>
            {currentUserTier ? (
              <LinkContainer
                to={{
                  pathname: '/swap',
                  state: {
                    from: 'BTC',
                    to: 'XLM'
                  }
                }}
              >
                <FooterButton
                  nature='primary'
                  onClick={handleRequest}
                  fullwidth
                >
                  <FormattedMessage
                    id='scenes.transaction.content.empty.xlm.swapcta'
                    defaultMessage='Get Stellar Now'
                  />
                </FooterButton>
              </LinkContainer>
            ) : (
              <LinkContainer to={'/swap/profile'}>
                <FooterButton
                  nature='primary'
                  onClick={handleRequest}
                  fullwidth
                >
                  <FormattedMessage
                    id='scenes.transaction.content.empty.xlm.signupcta'
                    defaultMessage='Get Stellar Now'
                  />
                </FooterButton>
              </LinkContainer>
            )}
          </Column>
          <Column style={{ paddingLeft: '20px' }}>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/360019105171-What-is-Stellar-'
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
    </Wrapper>
  )
}

WelcomePax.propTypes = {
  availability: PropTypes.object.isRequired,
  currentCoin: PropTypes.object.isRequired,
  currentUserTier: PropTypes.object.isRequired
}

export default WelcomePax
