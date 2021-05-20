import React from 'react'
import { FormattedMessage } from 'react-intl'
import linuxUpdater from 'assets/lockbox/lockbox-updater-1.0.0.AppImage'
import macUpdater from 'assets/lockbox/lockbox-updater-1.0.0.dmg'
import windowsUpdater from 'assets/lockbox/lockbox-updater-1.0.0.exe'
import Bowser from 'bowser'
import { prop } from 'ramda'
import styled from 'styled-components'

import {
  BlockchainLoader,
  Button,
  Icon,
  Link,
  Text
} from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
  margin-bottom: 24px;
`
const DownloadButton = styled(Button)`
  position: relative;
  height: 50px;
  margin: 30px 0 20px;
`
const DismissText = styled(Text)`
  color: ${props => props.theme.blue600};
  &:hover {
    cursor: pointer;
  }
`
const getOsSpecificUpdater = () => {
  const os = Bowser.getParser(window.navigator.userAgent).getOSName(true)
  switch (os) {
    case 'macos':
      return {
        extension: 'dmg',
        updater: macUpdater
      }
    case 'linux':
      return {
        extension: 'AppImage',
        updater: linuxUpdater
      }
    default:
      return {
        extension: 'exe',
        updater: windowsUpdater
      }
  }
}

const SoftwareDownloadStep = props => {
  const {
    hasDownloaded,
    onGoBackToDownload,
    onSkipDownload,
    onStartDownload,
    onStepChange
  } = props
  return hasDownloaded ? (
    <Wrapper>
      <HeadingWrapper>
        <BlockchainLoader width='80px' height='80px' />
      </HeadingWrapper>
      <Text size='13px' weight={500}>
        <FormattedMessage
          id='modals.lockboxsetup.softwaredownloadstep.downloaded.body'
          defaultMessage='The Lockbox software is now downloading. Once the download has finished, install and open the software, plug in your device and follow the in app instructions.'
        />
      </Text>
      <Text size='13px' weight={500} style={{ marginTop: '10px' }}>
        <FormattedMessage
          id='modals.lockboxsetup.softwaredownloadstep.downloaded.body2'
          defaultMessage='Once you have updated your device and <b>installed the Bitcoin app</b>, press the continue button below.'
        />
      </Text>
      <DownloadButton nature='primary' fullwidth onClick={onStepChange}>
        <Text size='16px' weight={500} color='white'>
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Text>
      </DownloadButton>
      <DismissText size='12px' weight={500} onClick={onGoBackToDownload}>
        <FormattedMessage
          id='modals.lockboxsetup.softwaredownloadstep.downloaded.dismiss'
          defaultMessage='Go back to download'
        />
      </DismissText>
    </Wrapper>
  ) : (
    <Wrapper>
      <HeadingWrapper>
        <Icon name='request' color='info' size='62px' />
        <Text size='18px' weight={500} style={{ marginTop: '18px' }}>
          <FormattedMessage
            id='modals.lockboxsetup.softwaredownloadstep.header'
            defaultMessage='Software Update Required'
          />
        </Text>
      </HeadingWrapper>
      <Text size='13px' weight={500}>
        <FormattedMessage
          id='modals.lockboxsetup.softwaredownloadstep.1body'
          defaultMessage='In order to use your Lockbox, you must first update your device by installing apps via the software below.'
        />
      </Text>
      <Text size='13px' weight={500} style={{ marginTop: '10px' }}>
        <FormattedMessage
          id='modals.lockboxsetup.softwaredownloadstep.2body'
          defaultMessage='This software is intended for Blockchain Lockbox devices only. If you have a Ledger Nano S, please update your device using Ledger Live.'
        />
      </Text>
      <Text size='13px' weight={500} style={{ marginTop: '10px' }}>
        <FormattedMessage
          id='modals.lockboxsetup.softwaredownloadstep.3body'
          defaultMessage='If you have previously updated your device, you may dismiss this and continue.'
        />
      </Text>
      <Link
        href={prop('updater', getOsSpecificUpdater())}
        download={`lockbox-updater-1.0.0.${prop(
          'extension',
          getOsSpecificUpdater()
        )}`}
      >
        <DownloadButton nature='primary' fullwidth onClick={onStartDownload}>
          <Text size='16px' weight={500} color='white'>
            <FormattedMessage
              id='modals.lockboxsetup.softwaredownloadstep.download'
              defaultMessage='Download Software'
            />
          </Text>
        </DownloadButton>
      </Link>
      <DismissText size='12px' weight={500} onClick={onSkipDownload}>
        <FormattedMessage
          id='modals.lockboxsetup.softwaredownloadstep.dismiss'
          defaultMessage="I've already updated, let's continue"
        />
      </DismissText>
    </Wrapper>
  )
}

export default SoftwareDownloadStep
