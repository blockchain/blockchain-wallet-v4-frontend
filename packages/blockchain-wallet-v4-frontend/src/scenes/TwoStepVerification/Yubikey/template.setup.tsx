import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Field } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import PasswordBox from 'components/Form/PasswordBox'
import { Analytics } from 'data/types'
import { required } from 'services/forms'

import { BackArrowFormHeader, CenteredColumn, TwoFactorSetupSteps } from '../model'
import { Props } from '.'

const YubiKeySetup = (props: Props) => {
  const { formatMessage } = useIntl()
  const handleSubmit = () => {
    props.securityCenterActions.setYubikey(props.formValues.newTwoFACode)
    props.analyticsActions.trackEvent({
      key: Analytics.ACCOUNT_RECOVERY_2FA_ACTIVATION,
      properties: {}
    })
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
          onClick={handleSubmit}
          style={{ marginTop: '24px' }}
          disabled={(props.formValues?.newTwoFACode.length || 0) < 1}
        >
          <FormattedMessage id='buttons.next' defaultMessage='Next' />
        </Button>
      </CenteredColumn>
    </>
  )
}

export default YubiKeySetup
