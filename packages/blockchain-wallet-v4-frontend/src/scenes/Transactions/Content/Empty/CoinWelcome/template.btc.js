import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import media from 'services/ResponsiveService'
import { lighten } from 'polished'

import { Button, Icon, Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding-top: 50px;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 0 auto 25px;
  width: 640px;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid ${props => props.theme['brand-quaternary']};
  ${media.mobile`
    flex-direction: column;
    width: 100%;
  `};
`
const Row = styled.div`
  width: 50%;
  padding: 25px;
  ${media.mobile`
    width: 100%;
    box-sizing: border-box;
  `};
`
const Content = styled(Text)`
  margin: 15px 0 20px 0;
  line-height: 1.4;
`
const CoinRow = styled.div`
  width: 50%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: ${props => lighten(0.4, props.theme['btc'])};
  ${media.mobile`
    width: 100%;
  `};
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  > button:first-child {
    margin-right: 15px;
  }
`
const LearnMoreContainer = styled(Link)`
  width: 640px;
  display: flex;
  justify-content: space-between;
  margin: 0px auto 25px;
  padding: 25px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
`
const LearnMoreText = styled(Text)`
  margin-right: 15px;
  color: ${props => props.theme['brand-secondary']};
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`

const BtcWelcome = props => {
  const { displayed, handleRequest, partner } = props

  return (
    <Wrapper displayed={displayed}>
      <Container>
        <Row>
          <Text size='24px' weight={400} color='brand-primary'>
            <FormattedMessage
              id='scenes.transaction.content.empty.bitcoinwelcome.yourbtcwallet'
              defaultMessage='Your BTC Wallet'
            />
          </Text>
          <Content weight={300}>
            <FormattedMessage
              id='scenes.transaction.content.empty.bitcoinwelcome.sendreqexchange'
              defaultMessage='Send, Request and Exchange Bitcoin (BTC) directly from your Blockchain Wallet.'
            />
          </Content>
          <ButtonContainer>
            {partner ? (
              <LinkContainer to='/buy-sell'>
                <Button nature='primary' fullwidth>
                  <FormattedMessage
                    id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.buy'
                    defaultMessage='Buy BTC'
                  />
                </Button>
              </LinkContainer>
            ) : (
              <Button
                nature='primary'
                onClick={handleRequest}
                fullwidth
                uppercase
              >
                <FormattedMessage
                  id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.getstarted.requestbtc'
                  defaultMessage='Get BTC'
                />
              </Button>
            )}
            <LinkContainer to='/exchange'>
              <Button nature='empty-secondary' fullwidth>
                <FormattedMessage
                  id='scenes.transaction.bitcoin.content.empty.bitcoinwelcome.getstarted.exchange'
                  defaultMessage='Exchange BTC'
                />
              </Button>
            </LinkContainer>
          </ButtonContainer>
        </Row>
        <CoinRow>
          <Icon name='btc-circle' color='btc' size='160px' />
        </CoinRow>
      </Container>
      <LearnMoreContainer
        href='https://blockchain.info/wallet/bitcoin-faq'
        target='_blank'
      >
        <Text size='15px'>
          <FormattedMessage
            id='scenes.transactions.bitcoin.content.empty.bitcoinwelcome.explanation'
            defaultMessage="We've put together a page explaining all of this."
          />
        </Text>
        <LearnMoreLink>
          <LearnMoreText size='15px'>
            <FormattedMessage
              id='scenes.lockbox.welcome.learnmore'
              defaultMessage='Learn More'
            />
          </LearnMoreText>
          <Icon name='short-right-arrow' color='brand-secondary' size='18px' />
        </LearnMoreLink>
      </LearnMoreContainer>
    </Wrapper>
  )
}

BtcWelcome.propTypes = {
  displayed: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired
}

export default BtcWelcome
