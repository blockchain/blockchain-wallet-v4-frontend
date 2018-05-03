import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Icon, Image } from 'blockchain-info-components'
import styled from 'styled-components'

const Choice = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  padding: 15px;
  cursor: pointer;
  opacity: ${props => props.selected && props.editing ? 1 : !props.editing ? 1 : 0.3};
  div * {
    cursor: pointer;
  }
`
const ChoiceDescription = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1224px) {
    padding-left: 10px;
  }
`
const TwoStepChoicesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  @media (min-width: 480px) {
    flex-direction: row;
  }

  @media (min-width: 1224px) {
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
    justify-content: space-evenly;
  }
`

function Choices (props) {
  const { authType, editing } = props

  return (
    <TwoStepChoicesWrapper>
      <Choice editing={editing} selected={authType === 4} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('google')}>
        <Icon name='lock' size='18px' weight={400} />
        <ChoiceDescription>
          <Text weight={300} size='14px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Authenticator App' />
          </Text>
          <Text weight={200} size='12px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Use app-generated codes' />
          </Text>
        </ChoiceDescription>
      </Choice>
      <Choice editing={editing} selected={authType === 1 || authType === 2} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('yubikey')}>
        <Image name='yubikey' height='18px' width='18px' />
        <ChoiceDescription>
          <Text weight={300} size='14px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Yubikey' />
          </Text>
          <Text weight={200} size='12px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Pair with your Yubikey' />
          </Text>
        </ChoiceDescription>
      </Choice>
      <Choice editing={editing} selected={authType === 5} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('sms')}>
        <Icon name='mobile' size='18px' weight={400} />
        <ChoiceDescription>
          <Text weight={300} size='14px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Mobile Phone Number' />
          </Text>
          <Text weight={200} size='12px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Use codes sent via SMS' />
          </Text>
        </ChoiceDescription>
      </Choice>
    </TwoStepChoicesWrapper>
  )
}

export default Choices
