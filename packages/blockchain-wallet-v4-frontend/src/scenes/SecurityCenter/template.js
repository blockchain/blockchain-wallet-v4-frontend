import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

import SecuritySteps from './SecuritySteps'
import EmailAddress from './EmailAddress'
import TwoStepVerification from './TwoStepVerification'
import WalletRecoveryPhrase from './WalletRecoveryPhrase'

const Wrapper = styled.div`
  padding: 30px;
  box-sizing: border-box;
`
const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40%;
`
const Title = styled(Text)`
`
const IntroText = styled(Text)`
  padding: 20px 0px
`

const SecurityCenter = () => {
  return (
    <Wrapper>
      <TopContainer>
        <IntroContainer>
          <Title size='24px' weight={300} color='black'><FormattedMessage id='scenes.securitycenter.title' defaultMessage='Security Center' /></Title>
          <IntroText size='14px' weight={300}>
            <FormattedMessage id='scenes.securitycenter.text' defaultMessage='Welcome to your Security Center! Complete the following three steps to help prevent unauthorized access to your wallet and ensure you can access your funds at any time.' />
          </IntroText>
        </IntroContainer>
        <SecuritySteps />
      </TopContainer>
      <EmailAddress />
      <TwoStepVerification />
      <WalletRecoveryPhrase />
    </Wrapper>
  )
}

export default SecurityCenter
