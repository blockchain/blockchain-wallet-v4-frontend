/* stylelint-disable */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Choice = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 15px;
  cursor: pointer;
  opacity: ${props =>
    props.selected && props.editing ? 1 : !props.editing ? 1 : 0.3};
  div * {
    cursor: pointer;
  }
  ${media.mobile`
    margin-bottom: 10px;
  `};
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
const YubikeyWrapper = styled.div`
  ${media.mobile`
    display: flex;
    align-items: center;
    margin-right: 3px;
  `};
`
const SecurityIcon = styled(Icon)`
  ${media.mobile`
    display: flex;
    align-items: center;
    margin-right: 3px;
  `};
`

function Choices(props) {
  const { authType, editing } = props

  return (
    <TwoStepChoicesWrapper>
      <Choice
        editing={editing}
        selected={authType === 4}
        onClick={
          editing && authType > 0
            ? () => props.pulseText()
            : () => props.chooseMethod('google')
        }
      >
        <SecurityIcon name='lock' size='18px' weight={500} />
        <ChoiceDescription>
          <Text weight={400} size='14px'>
            <FormattedMessage
              id='scenes.security.twostepsetup.useauthenticatortitle'
              defaultMessage='Authenticator App'
            />
          </Text>
          <Text weight={400} size='12px'>
            <FormattedMessage
              id='scenes.security.twostepsetup.useauthenticator'
              defaultMessage='Use app-generated codes'
            />
          </Text>
        </ChoiceDescription>
      </Choice>
      <Choice
        editing={editing}
        selected={authType === 1 || authType === 2}
        onClick={
          editing && authType > 0
            ? () => props.pulseText()
            : () => props.chooseMethod('yubikey')
        }
      >
        <YubikeyWrapper>
          <Image name='yubikey' height='18px' width='18px' />
        </YubikeyWrapper>
        <ChoiceDescription>
          <Text weight={400} size='14px'>
            <FormattedMessage
              id='scenes.security.twostepsetup.useyubikey.title'
              defaultMessage='Yubikey'
            />
          </Text>
          <Text weight={400} size='12px'>
            <FormattedMessage
              id='scenes.security.twostepsetup.useyubikey'
              defaultMessage='Pair with your Yubikey'
            />
          </Text>
        </ChoiceDescription>
      </Choice>
      <Choice
        editing={editing}
        selected={authType === 5}
        onClick={
          editing && authType > 0
            ? () => props.pulseText()
            : () => props.chooseMethod('sms')
        }
      >
        <SecurityIcon name='mobile' size='18px' weight={500} />
        <ChoiceDescription>
          <Text weight={400} size='14px'>
            <FormattedMessage
              id='scenes.security.twostepsetup.smstitle'
              defaultMessage='Mobile Phone Number'
            />
          </Text>
          <Text weight={400} size='12px'>
            <FormattedMessage
              id='scenes.security.twostepsetup.sms'
              defaultMessage='Use codes sent via SMS'
            />
          </Text>
        </ChoiceDescription>
      </Choice>
    </TwoStepChoicesWrapper>
  )
}

export default Choices
