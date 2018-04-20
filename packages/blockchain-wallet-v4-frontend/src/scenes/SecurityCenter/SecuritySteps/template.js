import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'

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
  background-color: ${props => props.success ? props.theme['brand-primary'] : props.theme['gray-2']};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const EmailSection = StepSection.extend`
  border-top-right-radius: ${props => props.radius ? '0px' : '50px'};
  border-bottom-right-radius: ${props => props.radius ? '0px' : '50px'};
`
const TwoStepSection = StepSection.extend`
  border-top-right-radius: ${props => props.rightRadius ? '0px' : '50px'};
  border-bottom-right-radius: ${props => props.rightRadius ? '0px' : '50px'};
  border-top-left-radius: ${props => props.leftRadius ? '0px' : '50px'};
  border-bottom-left-radius: ${props => props.leftRadius ? '0px' : '50px'};

`
const BackupSection = StepSection.extend`
  border-top-left-radius: ${props => props.radius ? '0px' : '50px'};
  border-bottom-left-radius: ${props => props.radius ? '0px' : '50px'};
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
`
const StepText = styled(Text)`
  display: flex;
  flex-direction: column;
  max-width: 86px;
  margin-left: 5px;
  margin-right: 5px;
  color: ${props => props.success ? props.theme['white'] : props.theme['brand-primary']};
`

const SecuritySteps = (props) => {
  const { emailVerified, authType, isMnemonicVerified } = props
  const emailSuccess = emailVerified > 0
  const twoFactorSuccess = authType > 0

  return (
    <Wrapper>
      <EmailSection success={emailSuccess} radius={emailSuccess && twoFactorSuccess}>
        <Circle>
          {emailSuccess && <Icon name='checkmark' color='success' size='30px' />}
        </Circle>
        <StepText success={emailSuccess} size='12px' weight={300}>
          <FormattedMessage id='scenes.securitycenter.step1' defaultMessage='Verified Email Address' />
        </StepText>
      </EmailSection>
      <TwoStepSection success={twoFactorSuccess} leftRadius={twoFactorSuccess && emailSuccess} rightRadius={twoFactorSuccess && isMnemonicVerified}>
        <Circle>
          {twoFactorSuccess && <Icon name='checkmark' color='success' size='30px' />}
        </Circle>
        <StepText success={twoFactorSuccess} size='12px' weight={300}>
          <FormattedMessage id='scenes.securitycenter.step2' defaultMessage='2FA' />
        </StepText>
      </TwoStepSection>
      <BackupSection success={isMnemonicVerified} radius={isMnemonicVerified && twoFactorSuccess}>
        <Circle>
          {isMnemonicVerified && <Icon name='checkmark' color='success' size='30px' />}
        </Circle>
        <StepText success={isMnemonicVerified} size='12px' weight={300}>
          <FormattedMessage id='scenes.securitycenter.step3' defaultMessage='Backup Phrase' />
        </StepText>
      </BackupSection>
    </Wrapper>
  )
}

export default SecuritySteps
