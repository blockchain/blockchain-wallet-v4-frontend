/* stylelint-disable */

import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { spacing } from 'services/styles'

const AuthenticatorSummary = styled.div`
  width: 100%;
  padding: 0px 20px;
  opacity: ${props => (props.success ? 0.3 : 1)};
  @media (min-width: 992px) {
    width: 110%;
  }
`
const YubikeyContainer = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const YubikeyCopy = styled.div`
  display: block;
`
const YubikeyInputWrapper = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0px 20px 0px;
  button {
    margin-top: 10px;
  }
`
const YubikeyInput = styled.input`
  display: block;
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.42;
  color: ${props => props.theme['grey800']};
  background-color: ${props => props.theme.white};
  background-image: none;
  outline-width: 0;
  user-select: text;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.grey100};

  &::-webkit-input-placeholder {
    color: ${props => props.theme.grey200};
  }
`

const Yubikey = props => {
  const { handleInput, handleSubmit, uiState, value } = props

  return (
    <form onSubmit={handleSubmit}>
      <AuthenticatorSummary success={uiState.successToggled}>
        <YubikeyContainer>
          <YubikeyCopy>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='scenes.security.twostepverification.yubi.step1'
                defaultMessage="1. Insert the Yubikey into your computer's USB port."
              />
            </Text>
            <Text size='14px' weight={400} style={spacing('mt-5')}>
              <FormattedMessage
                id='scenes.security.twostepverification.yubi.step2'
                defaultMessage='2. Pair your Yubikey.'
              />
            </Text>
          </YubikeyCopy>
          <YubikeyInputWrapper>
            <YubikeyInput
              type='password'
              name='yubikeyCode'
              value={value}
              onChange={handleInput}
            />
          </YubikeyInputWrapper>
          <Button nature='primary' type='submit'>
            <FormattedMessage
              id='scenes.security.twostepverification.yubi.submit'
              defaultMessage='Submit'
            />
          </Button>
        </YubikeyContainer>
      </AuthenticatorSummary>
    </form>
  )
}

Yubikey.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'securityYubikey' })(Yubikey)
