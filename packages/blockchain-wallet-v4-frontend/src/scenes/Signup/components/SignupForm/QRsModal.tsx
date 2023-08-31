import React from 'react'
import styled from 'styled-components'

import { Image, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import QRCodeWrapper from 'components/QRCode/Wrapper'

import { QRModalType } from '../SignupCard'

const ANDROID_URL = 'https://play.google.com/store/apps/details?id=piuk.blockchain.android'
const IOS_URL = 'https://apps.apple.com/us/app/blockchain-wallet-buy-bitcoin/id493253309'

const QRModal = styled(Modal)`
  position: relative;
  overflow: hidden;
  border: none;

  img {
    position: absolute;
    top: -10%;
  }
`

const QRModalHeader = styled(ModalHeader)`
  border-bottom-color: transparent;

  span {
    color: white !important;
  }
`

const QRModalBody = styled(ModalBody)`
  padding: 1rem;
  padding-top: 6px;
  text-align: center;

  > :not(:first-child) {
    margin-top: 1rem;
  }
`

type Props = {
  onClose: () => void
  platform: QRModalType
}

const QRsModal: React.FC<Props> = ({ onClose, platform }) => (
  <QRModal doNotHide size='medium'>
    <Image name='backgorund-modal-gradient' />
    <QRModalHeader onClose={onClose} />
    <QRModalBody>
      <Text color='white' size='1.5rem' weight={600} lineHeight='1.5'>
        Download the Blockchain.com App
      </Text>
      <Text color='white' size='1rem' weight={500}>
        To start enjoying your Blockchain.com experience, please continue using the mobile app
      </Text>
      <Text color='white' size='0.75rem'>
        Scan the QR code to download the {platform} app
      </Text>
      <QRCodeWrapper
        value={platform === 'iOS' ? IOS_URL : ANDROID_URL}
        size={248}
        style={{
          borderRadius: '1rem',
          boxShadow: 'inset 0px 3px 1px 0px #0000000a, inset 0px 3px 8px 0px #0000001f',
          padding: '1.5rem'
        }}
      />
    </QRModalBody>
  </QRModal>
)

export default QRsModal
