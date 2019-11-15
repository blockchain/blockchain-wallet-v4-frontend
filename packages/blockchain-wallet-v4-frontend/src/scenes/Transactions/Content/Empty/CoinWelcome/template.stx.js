import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding-top: 50px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto 25px;
  width: 700px;
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
const CoinHeader = styled(Text)`
  margin-bottom: 12px;
`
const Content = styled(Text)`
  line-height: 1.4;
`
const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: ${props => props.width || '100%'};
  align-items: flex-start;
  justify-content: center;
`
const LearnMoreContainer = styled(Link)`
  width: 700px;
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
const CTAContainer = styled.div`
  margin-top: 20px;
`

const Welcome = props => {
  const { currentCoin, currentKYCState, currentTags, onboardingActions } = props

  return (
    <Wrapper>
      <Container>
        <Row>
          <Column>
            <div>
              <CoinHeader size='24px' weight={500} color='brand-primary'>
                <FormattedMessage
                  id='scenes.transaction.content.empty.newcoinwallet'
                  defaultMessage='Your {coin} Wallet'
                  values={{ coin: currentCoin.coinTicker }}
                />
              </CoinHeader>
              <Content weight={400} color='grey900'>
                <FormattedMessage
                  id='scenes.transaction.content.empty.stxnew'
                  defaultMessage='Blockstack apps protect your digital rights and are powered by the {displayName} ({coinCode}) blockchain.'
                  values={{
                    displayName: currentCoin.displayName,
                    coinCode: currentCoin.coinCode
                  }}
                />
              </Content>
              <Content weight={600} color='grey900'>
                <FormattedMessage
                  id='scenes.transaction.content.empty.freestx'
                  defaultMessage='Complete your profile and get $10 for free.'
                />
              </Content>
              <CTAContainer>
                {currentTags[currentCoin.campaign] ? (
                  <Button nature='success'>
                    <Icon
                      name='parachute'
                      color='white'
                      size='16px'
                      style={{ marginRight: '8px' }}
                    />
                    <FormattedMessage
                      id='scenes.transaction.content.empty.airdropready'
                      defaultMessage='Airdrop Ready'
                    />
                  </Button>
                ) : currentKYCState === 'NONE' ? (
                  <Button
                    nature='primary'
                    onClick={() =>
                      onboardingActions.upgradeForAirdropSubmitClicked(
                        currentCoin.campaign
                      )
                    }
                  >
                    <FormattedMessage
                      id='scenes.transaction.content.empty.completeprofile'
                      defaultMessage='Complete Profile'
                    />
                  </Button>
                ) : (
                  <Button nature='warning'>
                    <FormattedMessage
                      id='scenes.transaction.content.empty.ineligibleforairdrop'
                      defaultMessage='Ineligible for Airdrop'
                    />
                  </Button>
                )}
              </CTAContainer>
            </div>
          </Column>
          <Column width='75%'>
            <Icon
              name={currentCoin.icons.circleFilled}
              color={currentCoin.colorCode}
              size='84px'
            />
          </Column>
        </Row>
        <Row>
          <Column>
            {currentCoin.learnMoreLink && (
              <LearnMoreContainer
                href={currentCoin.learnMoreLink}
                target='_blank'
              >
                <Text size='15px'>
                  <FormattedMessage
                    id='scenes.transaction.content.empty.getstarted.explanation'
                    defaultMessage="We've put together a page explaining all of this."
                  />
                </Text>
                <LearnMoreLink>
                  <LearnMoreText size='15px'>
                    <FormattedMessage
                      id='scenes.transaction.content.empty.getstarted.learnmore'
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
          </Column>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Welcome
