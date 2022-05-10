import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { TextInput } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/auth/types'

import ScreenHeader from '../../components/ScreenHeader'
import { ButtonNext, InputWrapper, StyledTemporaryButton } from '../AccountUpgrade.models'

const YubiKeySetup = (props) => {
  const { formatMessage } = useIntl()
  const [inputValue, setInputValue] = useState('')
  const [isInputValid, setIsInputValid] = useState(false)
  const steps = {
    actualStep: 2,
    totalSteps: 3
  }

  const handlePrev = () => {
    props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.SELECT_2FA_TYPE)
  }

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value }
    } = event
    if (!value) setIsInputValid(false)
    if (value.length === 44) setIsInputValid(true)
    setInputValue(value)
  }

  const handleSubmit = () => {
    props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.YUBIKEY_VERIFIED)
  }

  return (
    <>
      <Wrapper>
        <ScreenHeader
          handleBack={handlePrev}
          steps={steps}
          title={
            <FormattedMessage
              id='scenes.login.upgrade.yubikey.header'
              defaultMessage='Verify with Your Yubikey'
            />
          }
          description={
            <FormattedMessage
              id='scenes.login.upgrade.yubikey.text'
              defaultMessage='Insert the Yubikey into your computer´s USB port. Pair your Yubikey by tapping your key.'
            />
          }
        />
        <InputWrapper>
          <TextInput
            name='6digitcode'
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder={formatMessage({
              defaultMessage: 'Tap Yubikey to enter code',
              id: 'scenes.login.upgrade.googleAuthVerify.input.placeholder'
            })}
          />
        </InputWrapper>

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          disabled={isInputValid}
          fullwidth
          height='48px'
          onClick={handleSubmit}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </ButtonNext>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_SUCCESS)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() =>
          props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.YUBIKEY_VERIFIED)
        }
        type='button'
      >
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(YubiKeySetup)
