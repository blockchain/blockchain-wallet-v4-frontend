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
  border-radius: 50px 50px 50px 50px;
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
`

const SecuritySteps = (props) => {
  const { emailVerified, authType, isMnemonicVerified } = props
  return (
    <Wrapper>
      <Circle>
        {emailVerified > 0 && <Icon name='checkmark' color='success' size='30px' />}
      </Circle>
      <StepText color='brand-primary' size='12px' weight={300}>
        <FormattedMessage id='scenes.securitycenter.step1' defaultMessage='Verify Email Address' />
      </StepText>
      <Circle>
        {authType > 0 && <Icon name='checkmark' color='success' size='30px' />}
      </Circle>
      <StepText color='brand-primary' size='12px' weight={300}>
        <FormattedMessage id='scenes.securitycenter.step2' defaultMessage='Two-Step Verification' />
      </StepText>
      <Circle>
        {isMnemonicVerified && <Icon name='checkmark' color='success' size='30px' />}
      </Circle>
      <StepText color='brand-primary' size='12px' weight={300}>
        <FormattedMessage id='scenes.securitycenter.step3' defaultMessage='Backup Phrase' />
      </StepText>
    </Wrapper>
  )
}

export default SecuritySteps
