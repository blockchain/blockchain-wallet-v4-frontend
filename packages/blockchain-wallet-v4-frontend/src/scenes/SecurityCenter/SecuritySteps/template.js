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
  height: 50%;
  background-color: ${props => props.theme['gray-2']};
  border-radius: 50px;
`
const StepSection = styled.div`
  width: 34%;
  background-color: ${props =>
    props.success ? props.theme['brand-primary'] : props.theme['gray-2']};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${media.mobile`
    width: 33.5%;
  `};
`
const EmailSection = StepSection.extend`
  border-top-right-radius: ${props => (props.radius ? '0px' : '50px')};
  border-bottom-right-radius: ${props => (props.radius ? '0px' : '50px')};
`
const TwoStepSection = StepSection.extend`
  border-top-right-radius: ${props => (props.rightRadius ? '0px' : '50px')};
  border-bottom-right-radius: ${props => (props.rightRadius ? '0px' : '50px')};
  border-top-left-radius: ${props => (props.leftRadius ? '0px' : '50px')};
  border-bottom-left-radius: ${props => (props.leftRadius ? '0px' : '50px')};
`
const BackupSection = StepSection.extend`
  border-top-left-radius: ${props => (props.radius ? '0px' : '50px')};
  border-bottom-left-radius: ${props => (props.radius ? '0px' : '50px')};
`

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: white;
  border: 5px solid ${props => props.theme['brand-primary']};
  border-radius: 50px;
  ${media.mobile`
    width: 35px;
    height: 25px;
    min-width: 25px;
  `};
`
const StepText = styled(Text)`
  display: flex;
  flex-direction: column;
  max-width: 86px;
  margin-left: 5px;
  margin-right: 5px;
  word-break: break-word;
  color: ${props =>
    props.success ? props.theme['white'] : props.theme['brand-primary']};
`

const SecuritySteps = props => {
  const { emailVerified, authType, isMnemonicVerified } = props
  const emailSuccess = emailVerified > 0
  const twoFactorSuccess = authType > 0

  return (
    <MediaContextConsumer>
      {({ mobile }) => (
        <Wrapper>
          <EmailSection
            success={emailSuccess}
            radius={emailSuccess && twoFactorSuccess}
          >
            <Circle>
              {emailSuccess && (
                <Icon
                  name='checkmark'
                  color='success'
                  size={mobile ? '15px' : '30px'}
                />
              )}
            </Circle>
            <StepText success={emailSuccess} size='12px' weight={300}>
              {mobile ? (
                <FormattedMessage
                  id='scenes.securitycenter.steps.step1mobile'
                  defaultMessage='Verified Email'
                />
              ) : (
                <FormattedMessage
                  id='scenes.securitycenter.steps.step1'
                  defaultMessage='Verified Email Address'
                />
              )}
            </StepText>
          </EmailSection>
          <TwoStepSection
            success={twoFactorSuccess}
            leftRadius={twoFactorSuccess && emailSuccess}
            rightRadius={twoFactorSuccess && isMnemonicVerified}
          >
            <Circle>
              {twoFactorSuccess && (
                <Icon
                  name='checkmark'
                  color='success'
                  size={mobile ? '15px' : '30px'}
                />
              )}
            </Circle>
            <StepText success={twoFactorSuccess} size='12px' weight={300}>
              {mobile ? (
                <FormattedMessage
                  id='scenes.securitycenter.steps.step2mobile'
                  defaultMessage='2 Factor Auth'
                />
              ) : (
                <FormattedMessage
                  id='scenes.securitycenter.steps.step2'
                  defaultMessage='Two-Step Verification'
                />
              )}
            </StepText>
          </TwoStepSection>
          <BackupSection
            success={isMnemonicVerified}
            radius={isMnemonicVerified && twoFactorSuccess}
          >
            <Circle>
              {isMnemonicVerified && (
                <Icon
                  name='checkmark'
                  color='success'
                  size={mobile ? '15px' : '30px'}
                />
              )}
            </Circle>
            <StepText success={isMnemonicVerified} size='12px' weight={300}>
              <FormattedMessage
                id='scenes.securitycenter.steps.step3'
                defaultMessage='Backup Phrase'
              />
            </StepText>
          </BackupSection>
        </Wrapper>
      )}
    </MediaContextConsumer>
  )
}

export default SecuritySteps
