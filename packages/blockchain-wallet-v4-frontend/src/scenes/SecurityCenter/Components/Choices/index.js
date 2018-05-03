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
  padding-left: 10px;
`
const TwoStepChoicesWrapper = styled.div`
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
    <TwoStepChoicesWrapper>
      <Choice editing={editing} selected={authType === 4} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('google')}>
        <Icon name='lock' size='18px' weight={400} />
        <ChoiceDescription>
          <Text weight={300} size='14px'>
            <FormattedMessage id='scenes.security.twostepsetup.useauthenticatortitle' defaultMessage='Authenticator App' />
          </Text>
          <Text weight={200} size='12px'>
            <FormattedMessage id='scenes.security.twostepsetup.useauthenticator' defaultMessage='Use app-generated codes' />
          </Text>
        </ChoiceDescription>
      </Choice>
      <Choice editing={editing} selected={authType === 1 || authType === 2} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('yubikey')}>
        <Image name='yubikey' height='18px' width='18px' />
        <ChoiceDescription>
          <Text weight={300} size='14px'>
            <FormattedMessage id='scenes.security.twostepsetup.useyubikey.title' defaultMessage='Yubikey' />
          </Text>
          <Text weight={200} size='12px'>
            <FormattedMessage id='scenes.security.twostepsetup.useyubikey' defaultMessage='Pair with your Yubikey' />
          </Text>
        </ChoiceDescription>
      </Choice>
      <Choice editing={editing} selected={authType === 5} onClick={editing && authType > 0 ? () => props.pulseText() : () => props.chooseMethod('sms')}>
        <Icon name='mobile' size='18px' weight={400} />
        <ChoiceDescription>
          <Text weight={300} size='14px'>
            <FormattedMessage id='scenes.security.twostepsetup.smstitle' defaultMessage='Mobile Phone Number' />
          </Text>
          <Text weight={200} size='12px'>
            <FormattedMessage id='scenes.security.twostepsetup.sms' defaultMessage='Use codes sent via SMS' />
          </Text>
        </ChoiceDescription>
      </Choice>
    </TwoStepChoicesWrapper>
  )
}

export default Choices
