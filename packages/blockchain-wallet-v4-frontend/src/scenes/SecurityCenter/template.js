import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import { media } from 'services/styles'

const Wrapper = styled.div`
  padding: 10px 30px 30px;
  box-sizing: border-box;
`
const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  ${media.tabletL`
    flex-direction: column;
    text-align: center;
  `}
`
const IntroText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;

  & :first-child {
    padding: 20px 0;
  }

  ${media.atLeastTabletL`
    width: 40%;
  `}
`
const SecurityStepsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 50px;
  height: 50%;
`
const StepSection = styled.div`
  width: 33.333%;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${media.mobile`
    width: 33.5%;
  `};
`
const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  min-width: 50px;
  background-color: white;
  border: 5px solid ${props => props.theme.blue900};
  transition: background-color 0.4s, border 0.4s;
  border-radius: 50px;
  ${media.mobile`
    width: 35px;
    height: 25px;
    min-width: 25px;
  `};
  &.active {
    background-color: ${props => props.theme.grey000};
    border: 5px solid ${props => props.theme.grey000};
  }
`
const StepText = styled(Text)`
  display: flex;
  flex-direction: column;
  max-width: 120px;
  margin-left: 10px;
  margin-right: 20px;
  word-break: break-word;
  ${media.mobile`
    word-break: initial;
  `};
`
const SecurityCenter = props => {
  const { children, progress } = props
  const {
    emailComplete,
    mnemonicComplete,
    overallProgress,
    twoFactorComplete
  } = progress

  return (
    <Wrapper>
      <StatusWrapper>
        <IntroText>
          <Text size='14px' weight={400}>
            {overallProgress < 3 ? (
              <FormattedMessage
                id='scenes.securitycenter.introtextnone'
                defaultMessage='Complete the steps below to help prevent unauthorized access to your wallet. Add additional verification to access your funds at any time.'
              />
            ) : (
              <FormattedMessage
                id='scenes.securitycenter.introtextfour'
                defaultMessage='Congratulations, you have completed the initial steps in helping to prevent unauthorized access to your wallet and bringing you even closer to financial security. Remember to always use caution with where you store your wallet details, what information you share with others, and with phishing emails.'
              />
            )}
          </Text>
        </IntroText>
        <MediaContextConsumer>
          {({ mobile }) => (
            <SecurityStepsWrapper>
              <StepSection
                success={emailComplete}
                radius={emailComplete ? twoFactorComplete : undefined}
              >
                <Circle className={emailComplete ? 'active' : ''}>
                  {emailComplete ? (
                    <Icon
                      color='success'
                      name='checkmark-in-circle-filled'
                      size={mobile ? '15px' : '30px'}
                    />
                  ) : (
                    <Text size={mobile ? '14px' : '36px'}>1</Text>
                  )}
                </Circle>
                <StepText
                  success={emailComplete}
                  size={mobile ? '12px' : '14px'}
                  weight={400}
                >
                  {mobile ? (
                    <FormattedMessage
                      id='scenes.securitycenter.steps.step1mobile'
                      defaultMessage='Verified Email'
                    />
                  ) : (
                    <FormattedMessage
                      id='scenes.securitycenter.steps.step1.verify'
                      defaultMessage='Verify Your Personal Email'
                    />
                  )}
                </StepText>
              </StepSection>
              <StepSection
                success={twoFactorComplete}
                leftRadius={
                  twoFactorComplete && emailComplete ? 'true' : undefined
                }
                rightRadius={
                  twoFactorComplete && emailComplete ? 'true' : undefined
                }
              >
                <Circle className={twoFactorComplete ? 'active' : ''}>
                  {twoFactorComplete ? (
                    <Icon
                      color='success'
                      name='checkmark-in-circle-filled'
                      size={mobile ? '15px' : '30px'}
                    />
                  ) : (
                    <Text size={mobile ? '14px' : '36px'}>2</Text>
                  )}
                </Circle>
                <StepText
                  success={twoFactorComplete}
                  size={mobile ? '12px' : '14px'}
                  weight={400}
                >
                  {mobile ? (
                    <FormattedMessage
                      id='scenes.securitycenter.steps.step2mobile'
                      defaultMessage='2 Factor Auth'
                    />
                  ) : (
                    <FormattedMessage
                      id='scenes.securitycenter.steps.step2.verify'
                      defaultMessage='Turn on Two-Step Verification'
                    />
                  )}
                </StepText>
              </StepSection>
              <StepSection
                success={mnemonicComplete}
                radius={mnemonicComplete ? twoFactorComplete : undefined}
              >
                <Circle className={mnemonicComplete ? 'active' : ''}>
                  {mnemonicComplete ? (
                    <Icon
                      color='success'
                      name='checkmark-in-circle-filled'
                      size={mobile ? '15px' : '30px'}
                    />
                  ) : (
                    <Text size={mobile ? '14px' : '36px'}>3</Text>
                  )}
                </Circle>
                <StepText
                  success={mnemonicComplete}
                  size={mobile ? '12px' : '14px'}
                  weight={400}
                >
                  <FormattedMessage
                    id='scenes.securitycenter.steps.step3.savephrase'
                    defaultMessage='Save Secret Private Key Recovery Phrase'
                  />
                </StepText>
              </StepSection>
            </SecurityStepsWrapper>
          )}
        </MediaContextConsumer>
      </StatusWrapper>
      {children}
    </Wrapper>
  )
}

export default SecurityCenter
