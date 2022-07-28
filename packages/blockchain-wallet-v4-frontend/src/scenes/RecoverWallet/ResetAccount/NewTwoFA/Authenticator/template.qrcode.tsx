import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Badge, Button, Image, Text } from 'blockchain-info-components'
import CopyClipboard from 'components/Clipboard/CopyClipboard'
import QRCodeWrapper from 'components/QRCodeWrapper'

import { CenteredColumn } from '../../../model'
import { Props } from '.'

const StyledQrCode = styled(Image)`
  margin: 24px 0 32px 0;
`

const AppButtons = styled.footer`
  display: flex;
  > a {
    margin: 12px 8px 24px;
  }
`

const AuthenticatorCode = (props: Props) => {
  useEffect(() => {
    props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }, [])

  return (
    <>
      <CenteredColumn>
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
        </Text>
        <Text
          size='14px'
          weight={500}
          color='grey900'
          lineHeight='1.5'
          style={{ textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.login.upgrade.googleAuth.text'
            defaultMessage='With your Google Authenticator app, scan the QR code below to make a secure connection.'
          />
        </Text>
        {/* temporary placeholder image until user is authenticated into wallet */}
        <StyledQrCode name='qr-code' color='grey500' height='200px' />
        {/* <QRCodeWrapper size={150} value={props.data.googleAuthSecretUrl || ''} /> */}

        {/* <CopyClipboard address={props.data.secret || ''} /> */}
        <AppButtons>
          <Badge type='applestore_2fa' />
          <Badge type='googleplay_2fa' />
        </AppButtons>
      </CenteredColumn>

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
