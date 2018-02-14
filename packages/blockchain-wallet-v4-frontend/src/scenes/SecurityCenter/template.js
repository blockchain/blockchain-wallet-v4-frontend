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
  width: ${props => props.progress === 3 ? '100%' : '40%'};
`
const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  & > * {
    margin-top: 20px;
  }
`
const Title = styled(Text)`
`
const IntroText = styled(Text)`
  padding: 20px 0px
`

const SecurityCenter = (props) => {
  return (
    <Wrapper>
      <TopContainer>
        <IntroContainer progress={props.progress}>
          <Title size='24px' weight={300} color='black'><FormattedMessage id='scenes.securitycenter.title' defaultMessage='Security Center' /></Title>
          <IntroText size='14px' weight={300}>
            { props.progress < 1 && <FormattedMessage id='scenes.securitycenter.introtextnone' defaultMessage='Welcome to your Security Center! Complete the following three steps to help prevent unauthorized access to your wallet and ensure you can access your funds at any time.' />}
            { props.progress === 1 && <FormattedMessage id='scenes.securitycenter.introtextone' defaultMessage='Welcome to your Security Center! You have completed 1 of 3 steps to help prevent unauthorized access to your wallet and ensure that you can access your funds at any time.' /> }
            { props.progress === 2 && <FormattedMessage id='scenes.securitycenter.introtexttwo' defaultMessage='Welcome to your Security Center! You have completed 2 of 3 steps to help prevent unauthorized access to your wallet and ensure that you can access your funds at any time.' />}
            { props.progress === 3 && <FormattedMessage id='scenes.securitycenter.introtextthree' defaultMessage='Congratulations, you have completed the initial steps in helping to prevent unauthorized access to your wallet and bringing you even closer to financial security. Remember to always use caution with where you store your wallet details, what information you share with others, and with phishing emails.' />}
          </IntroText>
        </IntroContainer>
        {props.progress < 3 && <SecuritySteps data={props.data} /> }
      </TopContainer>
      <BodyContainer>
        <EmailAddress />
        <TwoStepVerification />
        <WalletRecoveryPhrase />
      </BodyContainer>
    </Wrapper>
  )
}

export default SecurityCenter
