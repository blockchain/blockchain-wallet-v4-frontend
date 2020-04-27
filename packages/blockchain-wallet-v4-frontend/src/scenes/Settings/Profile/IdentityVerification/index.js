import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import {
  Image,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { KYC_STATES } from 'data/modules/profile/model'
import { pathOr, propEq } from 'ramda'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import TierCard from 'components/IdentityVerification/TierCard'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  box-sizing: border-box;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
  }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    width: ${props => props.width || 'auto'};
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 15px;
  flex-wrap: wrap;

  &:not(:last-child) {
    max-width: 416px;
    margin-right: 40px;
    margin-top: 16px;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    min-height: 100%;
    width: ${props => props.width || '100%'};
    margin-bottom: 0;
  }
`

const SwapText = styled(Text)`
  margin-bottom: 10px;
  a {
    color: ${props => props.theme.blue600};
    text-decoration: none;
  }
`

const TierWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 16px;
  ${media.mobile`
    margin: 16px 0;
  `};
  > div:not(:first-child) {
    height: 24px;
    margin-top: 14px;
    margin-left: 4px;
    ${media.laptop`
      display: none;
    `};
  }
`
const LearnMoreContainer = styled.div`
  margin-top: 22px;
  ${media.mobile`
    margin-top: 10px;
  `};
`

const IdentityVerification = ({ userData, userTiers }) => {
  const tier2LimitAmount = pathOr('25000', [1, 'limits', 'daily'], userTiers)
  const tier2LimitCurrency = pathOr('USD', [1, 'limits', 'currency'], userTiers)
  const isUnderReview = propEq('kycState', KYC_STATES.UNDER_REVIEW, userData)

  const formattedTier2Limit =
    Exchange.getSymbol(tier2LimitCurrency) +
    Currency.formatFiat(tier2LimitAmount, 0)

  return (
    <Wrapper>
      <Container>
        <Row width='40%'>
          <Column>
            <SwapText size='20px' color='textBlack' weight={500}>
              <FormattedMessage
                id='scenes.profile.identityverification.tradingtitle'
                defaultMessage='Trading Limits'
              />
            </SwapText>
            <SwapText size='14px' weight={400}>
              <FormattedMessage
                id='scenes.profile.identityverification.swaplimit.tradelimits'
                defaultMessage='Our trading limits is how much you can trade each day. That includes Swap and Buy transactions, as well as Borrow. Limits are necessary for compliance and fraud prevention.'
              />
            </SwapText>
            <LearnMoreContainer>
              <SwapText size='13px' color='textBlack'>
                <FormattedMessage
                  id='scenes.profile.identityverification.swaplimit.wanttolearnmore'
                  defaultMessage='Want to learn more?'
                />
              </SwapText>
              <SwapText size='13px' weight={400}>
                <FormattedHTMLMessage
                  id='scenes.profile.identityverification.swaplimit.learnmoreread'
                  defaultMessage="Read the article we've put together on Trading Limits <a href='https://blockchain.zendesk.com/hc/en-us/articles/360018353031-Exchange-Limit-Amounts' rel='noopener noreferrer' target='_blank'>here</a>."
                />
              </SwapText>
            </LearnMoreContainer>
            <LearnMoreContainer>
              {isUnderReview && (
                <>
                  <SwapText>
                    <Image
                      name='warning-circle-filled'
                      width='32px'
                      height='32px'
                    />
                  </SwapText>
                  <SwapText size='14px'>
                    <FormattedMessage
                      id='scenes.profile.idv.swaplimit.airdropdisclaimer1'
                      defaultMessage="Gold verification is currently under review. Once verified you'll be able to use Swap (trading up to {tier2Limit}) and also be eligible for future crypto airdrops!"
                      values={{ tier2Limit: formattedTier2Limit }}
                    />
                  </SwapText>
                </>
              )}
            </LearnMoreContainer>
          </Column>
        </Row>
        <Row width='60%'>
          <Column>
            <TierWrapper>
              <TierCard tier={1} />
            </TierWrapper>
            <TierWrapper>
              <TierCard tier={2} />
              <TooltipHost id='swaplimit.airdrops.tooltip' data-place='right'>
                <TooltipIcon
                  size='24px'
                  name='question-in-circle-filled'
                  color='grey200'
                />
              </TooltipHost>
            </TierWrapper>
          </Column>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default IdentityVerification
