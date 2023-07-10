import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { isValidNumber } from 'libphonenumber-js'
import { Field } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import PhoneNumberBox from 'components/Form/PhoneNumberBox'
import TextBox from 'components/Form/TextBox'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'

import { BackArrowFormHeader, CenteredColumn, TwoFactorSetupSteps } from '../model'
import { Props } from '.'

const validMobileNumber = (value) =>
  isValidNumber(value) ? undefined : (
    <FormattedMessage id='formhelper.invalidmobilenumber' defaultMessage='Invalid mobile number' />
  )

const SMSSetup = (props: Props) => {
  const [showVerifyCodeField, setVerifyCodeField] = useState(false)

  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => props.setFormStep(TwoFactorSetupSteps.CHOOSE_TWOFA)}
      />
      <CenteredColumn>
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage
            id='scenes.security.twostepsetup.smstitle'
            defaultMessage='Mobile Phone Number'
          />
        </Text>
      </CenteredColumn>

      {showVerifyCodeField ? (
        <>
          <CenteredColumn>
            <Text
              size='16px'
              weight={500}
              color='grey900'
              lineHeight='1.5'
              style={{ marginBottom: '24px', textAlign: 'center' }}
            >
              <FormattedMessage
                id='scenes.security.twostepverification.sms.entermobile'
                defaultMessage='Enter your mobile number and click Get Code. A verification code will be sent.'
              />
            </Text>
            <Field name='verificationCode' component={TextBox} validate={[required]} />
            <Text
              weight={500}
              size='12px'
              color='blue600'
              onClick={() => setVerifyCodeField(false)}
              style={{ cursor: 'pointer', marginTop: '24px' }}
            >
              <FormattedMessage
                id='modals.mobilenumberchange.changenumbertitle'
                defaultMessage='Change Mobile Number'
              />
            </Text>
          </CenteredColumn>
          <Button
            nature='primary'
            data-e2e='submitCode'
            fullwidth
            height='48px'
            onClick={() => props.changeAuthenticatorStep(2)}
            style={{ marginTop: '24px' }}
          >
            <FormattedMessage
              id='scenes.recovery.setup2FA.submitCode'
              defaultMessage='Submit Code'
            />
          </Button>
        </>
      ) : (
        <>
          <CenteredColumn>
            <Text
              size='16px'
              weight={500}
              color='grey900'
              lineHeight='1.5'
              style={{ marginBottom: '24px', textAlign: 'center' }}
            >
              <FormattedMessage
                id='scenes.security.twostepverification.sms.entermobile'
                defaultMessage='Enter your mobile number and click Get Code. A verification code will be sent.'
              />
            </Text>

            <Field
              name='smsNumber'
              component={PhoneNumberBox}
              placeholder='212-555-5555'
              normalize={removeWhitespace}
              validate={[required, validMobileNumber]}
              noLastPass
              autoFocus
              data-e2e='smsNumber'
            />
          </CenteredColumn>
          <Button
            nature='primary'
            data-e2e='nextButton'
            fullwidth
            height='48px'
            onClick={() => setVerifyCodeField(true)}
            style={{ marginTop: '24px' }}
          >
            <FormattedMessage
              id='scenes.recovery.setup2FA.getCode'
              defaultMessage=' Get Verification Code'
            />
          </Button>
        </>
      )}
    </>
  )
}

export default SMSSetup
