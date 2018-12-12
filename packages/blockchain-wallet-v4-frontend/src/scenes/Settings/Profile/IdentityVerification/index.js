import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { values } from 'ramda'
import styled from 'styled-components'

import { KYC_STATES } from 'data/modules/profile/model'

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
    justify-content: center;
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
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 15px;
  flex-wrap: wrap;

  &:not(:last-child) {
    margin-right: 40px;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    min-height: 100%;
    width: ${props => props.width || '100%'};
    margin-bottom: ${props => props.marginBottom || 'none'};
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
  > div:last-child {
    height: 24px;
    margin-top: 14px;
    margin-left: 4px;
    ${media.laptop`
      display: none;
    `};
  }
`
const LearnMoreContainer = styled.div`
  margin-top: 40px;
`

const IdentityVerification = ({ userData, userTiers }) => {
  return (
    <Wrapper>
      <Container>
        <Row width='40%'>
          <Column>
            <SwapText size='20px' color='textBlack'>
              <FormattedMessage
                id='scenes.profile.identityverification.pagetitle'
                defaultMessage='Swap Limits'
              />
            </SwapText>
            <SwapText>
              <FormattedMessage
                id='scenes.profile.identityverification.swaplimit.explaination'
                defaultMessage='Your Swap Limit is how much digital currency you can trade each day. This is all a security precaution for local compliance and fraud prevention.'
              />
            </SwapText>
            <LearnMoreContainer>
              <SwapText size='14px' color='textBlack'>
                <FormattedMessage
                  id='scenes.profile.identityverification.swaplimit.wanttolearnmore'
                  defaultMessage='Want to learn more?'
                />
              </SwapText>
              <SwapText size='14px'>
                <FormattedHTMLMessage
                  id='scenes.profile.identityverification.swaplimit.learnmore'
                  defaultMessage="We've put together an article explaining how Swap Limits works. <a href='https://support.blockchain.com' rel='noopener noreferrer' target='_blank'>Read now.</a>"
                />
              </SwapText>
            </LearnMoreContainer>
          </Column>
        </Row>
        <Row width='60%'>
          <Column>
            <TierCard tier={1} userData={userData} userTiers={userTiers} />
            <br />
            <br />
            <TierWrapper>
              <TierCard tier={2} userData={userData} userTiers={userTiers} />
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

IdentityVerification.propTypes = {
  kycState: PropTypes.oneOf(values(KYC_STATES)).isRequired,
  verifyIdentity: PropTypes.func.isRequired
}

export default IdentityVerification
