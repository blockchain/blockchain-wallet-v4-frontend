import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Carousel, Image, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'

const Slide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: 0 40px;

  & > :first-child { margin-bottom: 20px; }
`

const UpgradeWizard = (props) => {
  const { position, total, ...rest } = props
  const { handleContinue } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.upgradewizard.title' defaultMessage='Welcome to your Blockchain Wallet!' />
      </ModalHeader>
      <ModalBody>
        <Carousel height={300} auto>
          <Slide>
            <Text size='18px' weight={300}>
              <FormattedMessage id='modals.upgradwizard.title1' defaultMessage='Completely updated design and user experience' />
            </Text>
            <Image name='wallet-v3-new-design' width='100%' />
          </Slide>
          <Slide>
            <Text size='20px' weight={300}>
              <FormattedMessage id='modals.upgradwizard.title2' defaultMessage='Robust security center' />
            </Text>
            <Image name='wallet-v3-security-upgrade' width='100%' />
          </Slide>
          <Slide>
            <Text size='20px' weight={300}>
              <FormattedMessage id='modals.upgradwizard.title3' defaultMessage='Simplified backup and recovery' />
            </Text>
            <Image name='wallet-v3-backup' width='100%' />
          </Slide>
          <Slide>
            <Text size='20px' weight={300}>
              <FormattedMessage id='modals.upgradwizard.title4' defaultMessage='Customized fund management' />
            </Text>
            <Image name='wallet-v3-fund-management' width='100%' />
          </Slide>
        </Carousel>
      </ModalBody>
      <ModalFooter align='right'>
        <Button type='submit' nature='primary' onClick={handleContinue}>
          <FormattedMessage id='modals.upgradewizard.continue' defaultMessage='Continue' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UpgradeWizard
