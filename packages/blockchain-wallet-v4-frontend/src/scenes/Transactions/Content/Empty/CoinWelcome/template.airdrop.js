import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'

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
  font-size: 14px;
  line-height: 1.4;
  > span {
    display: block;
    &:last-child {
      margin-top: 16px;
    }
  }
`
const CoinRow = styled.div`
  width: 50%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
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
  margin: 0 auto 25px;
  padding: 25px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${props => props.theme['gray-1']};
`
const LearnMoreText = styled(Text)`
  margin-right: 15px;
  color: ${props => props.theme['brand-secondary']};
`
const LearnMoreLink = styled(Link)`
  display: inline-flex;
`

const WelcomeAirdrop = props => {
  const { currentCoin, onboardingActions } = props

  return (
    <Wrapper>
      <Container>
        <Row>
          <Text size='24px' weight={500} color='brand-primary'>
            <FormattedMessage
              id='scenes.transaction.content.empty.airdrop.wallet'
              defaultMessage='We Now Offer {coinName} ({coinCode})'
              values={{
                coinName: currentCoin.displayName,
                coinCode: currentCoin.coinTicker
              }}
            />
          </Text>
          <Content weight={400}>
            <FormattedMessage
              id='scenes.transaction.content.empty.airdrop.sendreqexchange'
              defaultMessage='{coin} is a token that enables quick, low cost global transactions. Send, receive, and trade {coin} in the Wallet today.'
              values={{ coin: currentCoin.coinTicker }}
            />
            <FormattedMessage
              id='scenes.transaction.content.empty.airdrop.completeprofileforairdropfree'
              defaultMessage='Complete your profile today and we will airdrop free {coinName} ({coin}) in your Wallet.'
              values={{
                coinName: currentCoin.displayName,
                coin: currentCoin.coinTicker
              }}
            />
          </Content>
          <ButtonContainer>
            <Button
              nature='primary'
              fullwidth
              onClick={() =>
                onboardingActions.airdropReminderSubmitClicked(
                  currentCoin.campaign
                )
              }
            >
              <FormattedMessage
                id='scenes.transaction.content.empty.airdrop.claim'
                defaultMessage='Claim Your Free {coin} Now'
                values={{ coin: currentCoin.coinTicker }}
              />
            </Button>
          </ButtonContainer>
        </Row>
        <CoinRow>
          <Image
            name={currentCoin.airdrop.image}
            width='75%'
            srcset={{
              [`${currentCoin.airdrop.image}2`]: '2x',
              [`${currentCoin.airdrop.image}3`]: '3x'
            }}
          />
        </CoinRow>
      </Container>
      {currentCoin.airdrop.link && (
        <LearnMoreContainer href={currentCoin.airdrop.link} target='_blank'>
          <Text size='15px'>
            <FormattedMessage
              id='scenes.transactions.content.empty.explanation'
              defaultMessage="We've put together a page explaining all of this."
            />
          </Text>
          <LearnMoreLink>
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='scenes.transactions.content.empty.learnmore'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
            <Icon
              name='short-right-arrow'
              color='brand-secondary'
              size='18px'
            />
          </LearnMoreLink>
        </LearnMoreContainer>
      )}
    </Wrapper>
  )
}

WelcomeAirdrop.propTypes = {
  currentCoin: PropTypes.object.isRequired,
  domains: PropTypes.object.isRequired
}

export default WelcomeAirdrop
