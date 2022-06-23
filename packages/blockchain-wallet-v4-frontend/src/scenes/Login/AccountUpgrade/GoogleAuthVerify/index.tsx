import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { TextInput } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { TwoFASetupSteps, UpgradeSteps } from 'data/types'

import ScreenHeader from '../../components/ScreenHeader'
import { ButtonNext, InputWrapper, Label, StyledTemporaryButton } from '../AccountUpgrade.models'

const GoogleAuthVerify = (props) => {
  const [inputValue, setInputValue] = useState('')
  const [isInputValid, setIsInputValid] = useState(false)
  const { formatMessage } = useIntl()
  const steps = {
    actualStep: 2,
    totalSteps: 3
  }

  useEffect(() => {
    if (props.authType === 4) {
      props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_SUCCESS)
    }
  })

  const handlePrev = () => {
    props.formActions.change(LOGIN_FORM, 'step', TwoFASetupSteps.SELECT_2FA_TYPE)
  }

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value }
    } = event
    if (!value) setIsInputValid(false)
    if (value.length === 6) setIsInputValid(true)
    setInputValue(value)
  }

  const handleSubmit = () => {
    props.securityCenterActions.verifyGoogleAuthenticator(inputValue)
  }
  return (
    <>
      <Wrapper>
        <ScreenHeader
          handleBack={handlePrev}
          steps={steps}
          title={
            <FormattedMessage
              id='scenes.login.upgrade.googleAuthVerify.header'
              defaultMessage='Verify Your Google Account'
            />
          }
          description={
            <FormattedMessage
              id='scenes.login.upgrade.googleAuthVerify.text'
              defaultMessage='Enter the 6-digit code you see in your Google Auth App.'
            />
          }
        />
        <InputWrapper>
          <Label variant='paragraph-2' color='grey800'>
            <FormattedMessage
              id='scenes.login.upgrade.googleAuthVerify.6digitcode'
              defaultMessage='6 digit code'
            />
          </Label>
          <TextInput
            name='6digitcode'
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder={formatMessage({
              defaultMessage: 'Enter 6 digit code',
              id: 'scenes.login.upgrade.googleAuthVerify.6digitcode.placeholder'
            })}
          />
        </InputWrapper>
        <ButtonNext
          disabled={!isInputValid}
          nature='primary'
          data-e2e='nextButton'
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
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapStateToProps = (state) => ({
  authType: selectors.core.settings.getAuthType(state).getOrElse(0)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(GoogleAuthVerify)
