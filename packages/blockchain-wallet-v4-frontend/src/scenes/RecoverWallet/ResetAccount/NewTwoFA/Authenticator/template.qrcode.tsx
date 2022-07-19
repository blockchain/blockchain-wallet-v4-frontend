import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Badge, Button, Text } from 'blockchain-info-components'
import CopyClipboard from 'components/Clipboard/CopyClipboard'
import QRCodeWrapper from 'components/QRCodeWrapper'

import { Props } from '.'

const AuthenticatorCode = (props: Props) => {
  useEffect(() => {
    props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }, [])

  return (
    <>
      <Text>
        <FormattedMessage
          id='scenes.login.upgrade.googleAuth.text'
          defaultMessage='With your Google Authenticator app, scan the QR code below to make a secure connection.'
        />
      </Text>
      <Text>
        <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
      </Text>

      {/* <QRCodeWrapper size={150} value={props.data.googleAuthSecretUrl || ''} /> */}

      {/* <CopyClipboard address={props.data.secret || ''} /> */}

      <Badge type='applestore' />
      <Badge type='googleplay' />

      <Button
        nature='primary'
        data-e2e='nextButton'
        fullwidth
        height='48px'
        onClick={() => props.changeAuthenticatorStep(2)}
      >
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      </Button>
    </>
  )
}

export default AuthenticatorCode
