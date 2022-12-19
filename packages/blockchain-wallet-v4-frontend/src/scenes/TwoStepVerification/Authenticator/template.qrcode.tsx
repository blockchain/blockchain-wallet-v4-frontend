import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Badge, Button, Image, Text } from 'blockchain-info-components'
import CopyClipboard from 'components/Clipboard/CopyClipboard'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { isMobile } from 'services/styles'
import { getSecret } from 'utils/helpers'

import { BackArrowFormHeader, CenteredColumn, TwoFactorSetupSteps } from '../model'
import { Props } from '.'

const AppButtons = styled.footer`
  display: flex;
  > a {
    margin: 12px 8px 24px;
  }
`

const AuthenticatorCode = (props: Props) => {
  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => props.setFormStep(TwoFactorSetupSteps.CHOOSE_TWOFA)}
      />
      <CenteredColumn>
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
        </Text>
        <Text
          size='16px'
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
        {props.googleAuthSecretUrl && (
          <QRCodeWrapper size={150} value={props.googleAuthSecretUrl} />
        )}
        {isMobile() && props.googleAuthSecretUrl && (
          <CopyClipboard address={getSecret(props.googleAuthSecretUrl) || ''} />
        )}
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
