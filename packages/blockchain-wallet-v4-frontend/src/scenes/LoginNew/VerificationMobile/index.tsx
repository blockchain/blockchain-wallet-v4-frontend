import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { crypto as wCrypto } from 'blockchain-wallet-v4/src'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { selectors } from 'data'

import { LoginSteps, Props as OwnProps } from '..'
import { BackArrowFormHeader } from '../model'

const Body = styled.div`
  display: flex;
  margin-bottom: 44px;
`
const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 55%;
  margin-right: 24px;
`
const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const VerificationMobile = (props: InjectedFormProps<{}, Props> & Props) => {
  const { formValues, qrData, setStep } = props

  return (
    <>
      <BackArrowFormHeader formValues={formValues} setStep={setStep} />
      <Icon
        name='padlock'
        color='green600'
        size='20px'
        style={{ padding: '0 0 16px 4px' }}
      />
      <Body>
        <TextColumn>
          <Text color='grey900' size='16px' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.wallet.connected.title'
              defaultMessage='Mobile Device Connected'
            />
          </Text>
          <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.wallet.connected.description_1'
              defaultMessage='We sent your connected mobile device a notification. Open the app to confirm to auto-log in on the web.'
            />
          </Text>
          <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.wallet.connected.description_2'
              defaultMessage='Didn’t get the notification? Make sure you have push notifications enabled. You can also scan this QR with your mobile app to login.'
            />
          </Text>
        </TextColumn>
        <QRCodeWrapper value={qrData} size={qrData.length} showImage />
      </Body>
      <LinkRow>
        <Button
          nature='empty-blue'
          fullwidth
          height='48px'
          data-e2e='loginWithPassword'
          style={{ marginBottom: '24px' }}
          onClick={() => setStep(LoginSteps.ENTER_PASSWORD)}
        >
          <FormattedMessage
            id='buttons.login_with_password'
            defaultMessage='Login with Password'
          />
        </Button>
        <LinkContainer to='/help'>
          <Link size='13px' weight={600} data-e2e='loginGetHelp'>
            <FormattedMessage
              id='scenes.login.needhelp'
              defaultMessage='Need some help?'
            />
          </Link>
        </LinkContainer>
      </LinkRow>
    </>
  )
}

const mapStateToProps = state => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKey(state)
    ? JSON.stringify({
        type: 'login_wallet',
        channelId: selectors.cache.getChannelChannelId(state),
        pubkey: wCrypto
          .derivePubFromPriv(
            Buffer.from(selectors.cache.getChannelPrivKey(state), 'hex')
          )
          .toString('hex')
      })
    : '',
  secureChannelLoginState: selectors.auth.getSecureChannelLogin(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
} & ConnectedProps<typeof connector>

export default connector(VerificationMobile)
