import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, InjectedFormProps } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'

import { BackArrowFormHeader, CenteredColumn, TwoFactorSetupSteps } from '../model'
import { Props } from '.'

const YubiKeySetup = (props: Props) => {
  const { formatMessage } = useIntl()

  const handleSubmit = () => {
    props.securityCenterActions.setYubikey()
  }

  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => props.setFormStep(TwoFactorSetupSteps.CHOOSE_TWOFA)}
      />
      <CenteredColumn>
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage
            id='scenes.login.upgrade.yubikey.header'
            defaultMessage='Verify with Your Yubikey'
          />
        </Text>
        <Text
          size='16px'
          weight={500}
          color='grey900'
          lineHeight='1.5'
          style={{ marginBottom: '24px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.login.upgrade.yubikey.text'
            defaultMessage='Insert the Yubikey into your computer´s USB port. Pair your Yubikey by tapping your key.'
          />
        </Text>

        <Field
          name='newTwoFACode'
          component={PasswordBox}
          placeholder={formatMessage({
            defaultMessage: 'Tap Yubikey to enter code',
            id: 'scenes.login.upgrade.googleAuthVerify.input.placeholder'
          })}
          normalize={removeWhitespace}
          validate={[required]}
          noLastPass
          autoFocus
          data-e2e='recoverSetUpCode'
        />

        <Button
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          // TODO: Temporary step change
          onClick={() => props.changeAuthenticatorStep(2)}
          // onClick={handleSubmit}
          style={{ marginTop: '24px' }}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </Button>
      </CenteredColumn>
    </>
  )
}

export default YubiKeySetup
