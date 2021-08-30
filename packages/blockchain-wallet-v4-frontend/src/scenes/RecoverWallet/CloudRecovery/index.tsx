import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Badge, Icon, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { RemoteDataType } from 'core/types'
import { actions, selectors } from 'data'
import { RecoverSteps } from 'data/types'

import { Props as OwnProps } from '..'
import { BackArrowFormHeader, Column, GoBackArrow, Row } from '../model'

const Body = styled.div`
  display: flex;
  margin-bottom: 8px;
`
const TextColumn = styled(Column)`
  max-width: 60%;
  margin-right: 16px;
  > div {
    margin-bottom: 16px;
  }
`
const CenteredRow = styled(Row)`
  justify-content: center;
`
const BadgeRow = styled(CenteredRow)`
  margin: 24px 0;
  & > :first-child {
    margin-right: 16px;
  }
`

const CloudRecovery = (props: Props) => {
  const { cachedGuid, emailFromMagicLink, lastGuid, qrData } = props

  return (
    <Wrapper>
      {emailFromMagicLink && (
        <BackArrowFormHeader
          handleBackArrowClick={() => props.setStep(RecoverSteps.RECOVERY_OPTIONS)}
          email={emailFromMagicLink}
          guid={cachedGuid || lastGuid}
        />
      )}
      {!emailFromMagicLink && (
        <GoBackArrow handleBackArrowClick={() => props.setStep(RecoverSteps.RECOVERY_OPTIONS)} />
      )}
      <Body>
        {!props.phonePubKey && (
          <TextColumn>
            <Icon name='padlock' color='blue600' size='20px' style={{ padding: '0 0 16px 4px' }} />
            <Text
              color='grey900'
              size='16px'
              weight={600}
              lineHeight='1.5'
              style={{ marginBottom: '8px' }}
            >
              <FormattedMessage id='scenes.login.qrcodelogin' defaultMessage='QR Code Log In' />
            </Text>
            <Text
              color='grey900'
              size='12px'
              weight={500}
              lineHeight='1.5'
              style={{ marginBottom: '16px' }}
            >
              <FormattedMessage
                id='scenes.recovery.cloud_backup.subtitle'
                defaultMessage='If your wallet has been backed up to the cloud, scan this QR code with your Blockchain.com mobile app.'
              />
            </Text>
            <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.wallet.mobile_login.description.ios'
                defaultMessage='iOS - Tap the Menu button at the top left corner of the app to reveal Web Log In option.'
              />
            </Text>
            <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.wallet.mobile_login.description.android'
                defaultMessage='Android - Tap the QR code icon at the top right corner of the app.'
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
      <BadgeRow>
        <Badge size='40px' type='applestore' />
        <Badge size='40px' type='googleplay' />
      </BadgeRow>
      <CenteredRow>
        <LinkContainer to='/help'>
          <Link size='13px' weight={600} data-e2e='loginGetHelp'>
            <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
          </Link>
        </LinkContainer>
      </CenteredRow>
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKeyForQrData(state),
  secureChannelLoginState: selectors.auth.getSecureChannelLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  middlewareActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & {
  setStep: (step: RecoverSteps) => void
} & ConnectedProps<typeof connector>

export default connector(CloudRecovery)
