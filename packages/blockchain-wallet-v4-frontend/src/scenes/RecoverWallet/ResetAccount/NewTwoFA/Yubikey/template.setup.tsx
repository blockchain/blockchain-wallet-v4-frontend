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
import { actions } from 'data'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'

import { Props } from '.'

const YubiKeySetup = (props: Props) => {
  const { formatMessage } = useIntl()

  const handleSubmit = () => {
    props.securityCenterActions.setYubikey()
  }

  return (
    <>
      <Text>
        <FormattedMessage
          id='scenes.login.upgrade.yubikey.header'
          defaultMessage='Verify with Your Yubikey'
        />
      </Text>
      <Text>
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

      <Button nature='primary' data-e2e='nextButton' fullwidth height='48px' onClick={handleSubmit}>
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      </Button>
    </>
  )
}

export default YubiKeySetup
