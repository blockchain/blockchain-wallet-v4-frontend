import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

const Wrapper = styled.div`
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
  border: 5px solid ${props => props.theme['brand-primary']};
  transition: background-color 0.4s, border 0.4s;
  border-radius: 50px;
  ${media.mobile`
    width: 35px;
    height: 25px;
    min-width: 25px;
  `};
  &.active {
    background-color: ${props => props.theme['white-blue']};
    border: 5px solid ${props => props.theme['white-blue']};
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

const SecuritySteps = props => {
  const { emailVerified, authType, isMnemonicVerified } = props
  const emailSuccess = emailVerified > 0
  const twoFactorSuccess = authType > 0

  return (
    <MediaContextConsumer>
      {({ mobile }) => (
        <Wrapper>
          <StepSection
            success={emailSuccess}
            radius={emailSuccess ? twoFactorSuccess : undefined}
          >
            <Circle className={emailSuccess ? 'active' : ''}>
              {emailSuccess ? (
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
              success={emailSuccess}
              size={mobile ? '12px' : '14px'}
              weight={300}
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
            success={twoFactorSuccess}
            leftRadius={twoFactorSuccess && emailSuccess}
            rightRadius={twoFactorSuccess && isMnemonicVerified}
          >
            <Circle className={twoFactorSuccess ? 'active' : ''}>
              {twoFactorSuccess ? (
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
              success={twoFactorSuccess}
              size={mobile ? '12px' : '14px'}
              weight={300}
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
            success={isMnemonicVerified}
            radius={isMnemonicVerified ? twoFactorSuccess : undefined}
          >
            <Circle className={isMnemonicVerified ? 'active' : ''}>
              {isMnemonicVerified ? (
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
              success={isMnemonicVerified}
              size={mobile ? '12px' : '14px'}
              weight={300}
            >
              <FormattedMessage
                id='scenes.securitycenter.steps.step3.save'
                defaultMessage='Save Backup Phrase'
              />
            </StepText>
          </StepSection>
        </Wrapper>
      )}
    </MediaContextConsumer>
  )
}

export default SecuritySteps
