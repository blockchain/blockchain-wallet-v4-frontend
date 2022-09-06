import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCheckCircle, PaletteColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'

import { BackArrowFormHeader, CenteredColumn } from '../model'
import { Props } from '.'

const SMSVerified = (props: Props) => {
  return (
    <>
      <BackArrowFormHeader handleBackArrowClick={() => props.changeAuthenticatorStep(1)} />
      <CenteredColumn>
        <IconCheckCircle
          label='checkmark-circle-filled'
          color={PaletteColors['green-600']}
          size='large'
        />

        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage
            id='scenes.recovery.sms_verified.header'
            defaultMessage='Mobile Number Verified'
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
            id='components.alerts.twofa_mobile_verify_success'
            defaultMessage='Your mobile number is now your two-factor authentication method.'
          />
        </Text>
      </CenteredColumn>
      <Button
        nature='primary'
        data-e2e='nextButton'
        fullwidth
        height='48px'
        // onClick={handleNext}
      >
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      </Button>
    </>
  )
}

export default SMSVerified
