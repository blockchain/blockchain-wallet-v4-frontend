import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { crypto as wCrypto } from 'blockchain-wallet-v4/src'
import { SuccessCartridge } from 'components/Cartridge'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { RemoteDataType } from 'core/types'
import { actions, selectors } from 'data'
import { LoginSteps } from 'data/types'

import { Props as OwnProps } from '..'
import {
  BackArrowFormHeader,
  CartridgeSentContainer,
  LOGIN_FORM_NAME,
  NeedHelpLink,
  Row
} from '../model'

const Body = styled.div`
  display: flex;
  margin-bottom: 24px;
`
const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 55%;
  margin-right: 24px;
`
const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const VerificationMobile = (props: Props) => {
  const { cacheActions, middlewareActions, qrData, setStep } = props

  const handleBackArrowClick = () => {
    props.cacheActions.removedStoredLogin()
    props.formActions.destroy(LOGIN_FORM_NAME)
    props.setStep(LoginSteps.ENTER_EMAIL_GUID)
    props.authActions.clearLoginError()
  }

  return (
    <>
      <BackArrowFormHeader {...props} handleBackArrowClick={handleBackArrowClick} />
      <Body>
        {!props.phonePubKey && (
          <TextColumn>
            <Icon name='padlock' color='blue600' size='20px' style={{ padding: '0 0 16px 4px' }} />
            <Text
              color='grey900'
              size='16px'
              weight={600}
              lineHeight='1.5'
              style={{ marginBottom: '16px' }}
            >
              <FormattedMessage
                id='scenes.login.wallet.mobile_login.title'
                defaultMessage='Log in with mobile app'
              />
            </Text>
            <Text
              color='grey900'
              size='12px'
              weight={500}
              lineHeight='1.5'
              style={{ marginBottom: '16px' }}
            >
              <FormattedMessage
                id='scenes.login.wallet.mobile_login.description_1'
                defaultMessage='Scan this QR code with the Blockchain.com mobile app.'
              />
            </Text>
            <Row>
              <Text
                color='grey900'
                size='12px'
                weight={500}
                lineHeight='1.5'
                style={{ marginRight: '4px' }}
              >
                <FormattedMessage
                  id='scenes.recovery.cloud_backup.instructions_two'
                  defaultMessage='Tap the QR Code Scanner icon'
                />
              </Text>
              <Icon name='qr-code' color='grey600' size='12px' />
            </Row>
            <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.recovery.cloud_backup.instructions_three'
                defaultMessage='in the top right & point here.'
              />
            </Text>
          </TextColumn>
        )}
        {props.secureChannelLoginState.cata({
          Failure: (e) => (
            <Text>
              {typeof e === 'string' ? (
                e
              ) : (
                <FormattedMessage
                  id='scenes.login.qrcodelogin_failed'
                  defaultMessage='Login failed. Please refresh browser and try again.'
                />
              )}
            </Text>
          ),
          Loading: () => {
            return (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.login.qrcodelogin_success_confirm'
                  defaultMessage='Please confirm the login on your mobile device.'
                />
              </Text>
            )
          },
          NotAsked: () => <QRCodeWrapper value={qrData} size={175} showImage />,
          Success: () => {
            return (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.login.qrcodelogin_success'
                  defaultMessage='Success! Logging in...'
                />
              </Text>
            )
          }
        })}
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
          <FormattedMessage id='buttons.login_with_password' defaultMessage='Login with Password' />
        </Button>
        <NeedHelpLink />
      </LinkRow>
    </>
  )
}

const mapStateToProps = (state) => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKey(state)
    ? JSON.stringify({
        channelId: selectors.cache.getChannelChannelId(state),
        pubkey: wCrypto
          .derivePubFromPriv(Buffer.from(selectors.cache.getChannelPrivKey(state), 'hex'))
          .toString('hex'),
        type: 'login_wallet'
      })
    : '',
  secureChannelLoginState: selectors.auth.getSecureChannelLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  middlewareActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & {
  setStep: (step: LoginSteps) => void
} & ConnectedProps<typeof connector>

export default connector(VerificationMobile)
