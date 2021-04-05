import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Carousel,
  Image,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const Slide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: 0 40px;

  & > :first-child {
    margin-bottom: 20px;
  }
`

const UpgradeWallet = props => {
  const { position, total, ...rest } = props
  const { handleContinue } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage
          id='modals.upgradewallet.title'
          defaultMessage='Welcome to your Blockchain Wallet!'
        />
      </ModalHeader>
      <ModalBody>
        <Carousel height={300} auto>
          <Slide>
            <Text size='18px' weight={400}>
              <FormattedMessage
                id='modals.upgradewallet.title1'
                defaultMessage='Completely updated design and user experience'
              />
            </Text>
            <Image name='wallet-v3-new-design' width='100%' />
          </Slide>
          <Slide>
            <Text size='20px' weight={400}>
              <FormattedMessage
                id='modals.upgradewallet.title2'
                defaultMessage='Robust security center'
              />
            </Text>
            <Image name='wallet-v3-security-upgrade' width='100%' />
          </Slide>
          <Slide>
            <Text size='20px' weight={400}>
              <FormattedMessage
                id='modals.upgradewallet.title3'
                defaultMessage='Simplified backup and recovery'
              />
            </Text>
            <Image name='wallet-v3-backup' width='100%' />
          </Slide>
          <Slide>
            <Text size='20px' weight={400}>
              <FormattedMessage
                id='modals.upgradewallet.title4'
                defaultMessage='Customized fund management'
              />
            </Text>
            <Image name='wallet-v3-fund-management' width='100%' />
          </Slide>
        </Carousel>
      </ModalBody>
      <ModalFooter align='right'>
        <Button nature='primary' onClick={handleContinue}>
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UpgradeWallet
