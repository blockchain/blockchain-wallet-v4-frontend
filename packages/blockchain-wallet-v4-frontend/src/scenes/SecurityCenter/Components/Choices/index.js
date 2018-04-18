import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Icon } from 'blockchain-info-components'
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
  padding-left: 10px;
`
const TwoStepChoicesWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  margin-top: 30px;
  margin-bottom: 30px;
`

function Choices (props) {
  const { authType, editing } = props

  return (
    <TwoStepChoicesWapper>
      <Choice editing={editing} selected={authType === 4} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('google')}>
        <Icon name='lock' size='18px' weight={400} />
        <ChoiceDescription>
          <Text weight={300} size='14px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Authenticator App' />
          </Text>
          <Text weight={200} size='12px'>
            <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Use App generated codes' />
          </Text>
        </ChoiceDescription>
      </Choice>
      <Choice editing={editing} selected={authType === 1 || authType === 2} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('yubikey')}>
        <Icon name='yubikey' />
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
    </TwoStepChoicesWapper>
  )
}

export default Choices
