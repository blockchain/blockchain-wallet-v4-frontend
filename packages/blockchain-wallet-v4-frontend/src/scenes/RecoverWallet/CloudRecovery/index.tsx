import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { RemoteDataType } from '@core/types'
import { Image, Link, Text } from 'blockchain-info-components'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { actions, selectors } from 'data'
import { RecoverSteps } from 'data/types'

import { Props as OwnProps } from '..'
import {
  BackArrowFormHeader,
  CenteredColumn,
  Column,
  ContactSupportText,
  GoBackArrow,
  OuterWrapper,
  Row,
  SubCard,
  TryAnotherMethodRow,
  WrapperWithPadding
} from '../model'

const ANDROID_URL = 'https://play.google.com/store/apps/details?id=piuk.blockchain.android'
const IOS_URL = 'https://apps.apple.com/us/app/blockchain-wallet-buy-bitcoin/id493253309'

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
  margin: 16px 0;
  & > :first-child {
    margin-right: 16px;
  }
`
const AppStoreBadge = styled(Image)<{ showAppStoreQrCode?: boolean }>`
  cursor: pointer;
  height: ${(props) => (props.showAppStoreQrCode ? '52px' : '48px')};
`
const PlayStoreBadge = styled(Image)<{ showPlayStoreQrCode?: boolean }>`
  cursor: pointer;
  height: ${(props) => (props.showPlayStoreQrCode ? '52px' : '48px')};
`

const InstructionText = styled(Text)`
  a {
    text-decoration: none;
  }
`

const CloudRecovery = (props: Props) => {
  const [showAppStoreQrCode, toggleAppStoreQrCode] = useState(false)
  const [showPlayStoreQrCode, togglePlayStoreQrCode] = useState(false)
  const { cachedGuid, emailFromMagicLink, lastGuid, qrData, setStep } = props

  const link = showAppStoreQrCode ? IOS_URL : ANDROID_URL

  const appleStoreBadgeClicked = () => {
    togglePlayStoreQrCode(false)
    toggleAppStoreQrCode(true)
  }

  const playStoreBadgeClicked = () => {
    toggleAppStoreQrCode(false)
    togglePlayStoreQrCode(true)
  }

  return (
    <OuterWrapper>
      <WrapperWithPadding>
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
        <Text
          size='20px'
          color='grey900'
          weight={600}
          lineHeight='1.5'
          style={{ textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.cloud_recovery.title'
            defaultMessage='Open the Blockchain.com app on your mobile device to recover'
          />
        </Text>
        <Text
          size='14px'
          color='grey600'
          weight={500}
          lineHeight='1.5'
          style={{ marginTop: '8px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.cloud_recovery.body_part_one'
            defaultMessage='Looks like your account was backed up in the cloud from the Blockchain.com mobile app. Simply open the app to recover your account.'
          />
        </Text>
        <Text
          size='14px'
          color='grey600'
          weight={500}
          lineHeight='1.5'
          style={{ marginTop: '16px', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.cloud_recovery.install_app'
            defaultMessage='Or install the app first'
          />
        </Text>

        <BadgeRow>
          <Link onClick={appleStoreBadgeClicked}>
            <AppStoreBadge name='apple-app-store-badge' showAppStoreQrCode={showAppStoreQrCode} />
          </Link>
          <Link onClick={playStoreBadgeClicked}>
            <PlayStoreBadge name='google-play-badge' showPlayStoreQrCode={showPlayStoreQrCode} />
          </Link>
        </BadgeRow>
        {(showAppStoreQrCode || showPlayStoreQrCode) && (
          <InstructionText
            size='14px'
            color='grey600'
            weight={600}
            lineHeight='1.5'
            style={{ marginTop: '8px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.cloud_recovery.body_part_two'
              defaultMessage='If you don’t have the app installed, scan the QR code with your phone’s camera or <a>click here</a> to install.'
              values={{
                a: (msg) => (
                  <a href={link} rel='noopener noreferrer' target='_blank'>
                    {msg}
                  </a>
                )
              }}
            />
          </InstructionText>
        )}
        {showAppStoreQrCode && (
          <CenteredColumn>
            <QRCodeWrapper value={IOS_URL} size={220} />
          </CenteredColumn>
        )}
        {showPlayStoreQrCode && (
          <CenteredColumn>
            <QRCodeWrapper value={ANDROID_URL} size={220} />
          </CenteredColumn>
        )}
      </WrapperWithPadding>
      <SubCard>
        <TryAnotherMethodRow>
          <Text
            size='14px'
            weight={600}
            color='blue600'
            data-e2e='loginGetHelp'
            style={{ marginTop: '16px' }}
            onClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)}
          >
            <FormattedMessage id='copy.try_another' defaultMessage='Try Another Method' />
          </Text>
        </TryAnotherMethodRow>
      </SubCard>
    </OuterWrapper>
  )
}

const mapStateToProps = (state) => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKeyForQrData(state),
  secureChannelLoginStateR: selectors.auth.getSecureChannelLogin(state) as RemoteDataType<
    string,
    undefined
  >
})

const mapDispatchToProps = (dispatch) => ({
  middlewareActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & {
  setStep: (step: RecoverSteps) => void
} & ConnectedProps<typeof connector>

export default connector(CloudRecovery)
