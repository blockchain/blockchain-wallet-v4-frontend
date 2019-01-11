import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import styled from 'styled-components'

import { Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import TierCard from 'components/IdentityVerification/TierCard'
import media from 'services/ResponsiveService'

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
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    min-height: 100%;
    width: ${props => props.width || '100%'};
    margin-bottom: 'none';
  }
`

const SwapText = styled(Text)`
  margin-bottom: 10px;
  a {
    color: ${props => props.theme['brand-secondary']};
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

const IdentityVerification = () => {
  return (
    <Wrapper>
      <Container>
        <Row width='40%'>
          <Column>
            <SwapText size='17px' color='textBlack'>
              <FormattedMessage
                id='scenes.profile.identityverification.pagetitle'
                defaultMessage='Swap Limits'
              />
            </SwapText>
            <SwapText size='14px' weight={300}>
              <FormattedMessage
                id='scenes.profile.identityverification.swaplimit.sawp_limit'
                defaultMessage='Your Swap Limit is how much crypto you can trade each day. Swap Limits are necessary for compliance and fraud prevention.'
              />
            </SwapText>
            <LearnMoreContainer>
              <SwapText size='12px' color='textBlack'>
                <FormattedMessage
                  id='scenes.profile.identityverification.swaplimit.wanttolearnmore'
                  defaultMessage='Want to learn more?'
                />
              </SwapText>
              <SwapText size='12px' weight={300}>
                <FormattedHTMLMessage
                  id='scenes.profile.identityverification.swaplimit.learn_more_limits'
                  defaultMessage="We’ve put together an article on Swap Limits. <a href='https://blockchain.zendesk.com/hc/en-us/articles/360018353031-Exchange-Limit-Amounts' rel='noopener noreferrer' target='_blank'>Learn more.</a>"
                />
              </SwapText>
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
                  color='gray-2'
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
