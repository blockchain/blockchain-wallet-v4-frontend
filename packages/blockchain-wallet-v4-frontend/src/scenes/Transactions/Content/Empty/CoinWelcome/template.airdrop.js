import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { coinProps } from './model'

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

const WelcomeAirdrop = props => {
  const { coin, domains } = props

  return (
    <Wrapper>
      <Container>
        <Row>
          <Text size='24px' weight={400} color='brand-primary'>
            <FormattedMessage
              id='scenes.transaction.content.empty.airdrop.yourcoinwallet'
              defaultMessage='We Now Offer {coinName} ({coin})'
              values={{ coinName: coinProps[coin].name, coin }}
            />
          </Text>
          <Content weight={300}>
            <FormattedMessage
              id='scenes.transaction.content.empty.airdrop.sendreqexchange'
              defaultMessage='{coin} is a token that enables quick, low cost global transactions. Send, receive, and trade {coin} in the Wallet today.'
              values={{ coinName: coinProps[coin].name, coin }}
            />
          </Content>
          <ButtonContainer>
            <Link
              href={domains.comRoot + '/getcrypto'}
              target='_blank'
              style={{ width: '100%' }}
            >
              <Button nature='primary' fullwidth>
                <FormattedMessage
                  id='scenes.transaction.content.empty.airdrop.claim'
                  defaultMessage='Claim Your Free {coin} Now'
                  values={{ coin }}
                />
              </Button>
            </Link>
          </ButtonContainer>
        </Row>
        <CoinRow coin={coin.toLowerCase()}>
          <Image
            name={coinProps[coin].airdrop.image}
            width='75%'
            srcset={{
              [`${coinProps[coin].airdrop.image}2`]: '2x',
              [`${coinProps[coin].airdrop.image}3`]: '3x'
            }}
          />
        </CoinRow>
      </Container>
      {coinProps[coin].airdrop.link && (
        <LearnMoreContainer href={coinProps[coin].airdrop.link} target='_blank'>
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
  coin: PropTypes.string.isRequired,
  domains: PropTypes.object.isRequired
}

export default WelcomeAirdrop
