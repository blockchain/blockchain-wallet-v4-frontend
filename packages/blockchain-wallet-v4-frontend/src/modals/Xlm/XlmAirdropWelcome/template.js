import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  Text
} from 'blockchain-info-components'

const WelcomeModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  > span {
    color: ${props => props.theme['gray-1']};
  }
`
const Container = styled.div`
  > div:nth-child(2) {
    margin: 10px 0 20px 0;
  }
`

const AirdropWelcome = props => {
  const { position, total, close, verifyIdentity } = props

  return (
    <Modal size='medium' position={position} total={total}>
      <WelcomeModalHeader onClose={close} />
      <Image name='airdrop-welcome' width='100%' />
      <ModalBody>
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.claim'
              defaultMessage='Claim Your Stellar'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verifyidentity'
              defaultMessage="Verify your identity to claim your XLM. It only takes a few minutes. Once verified, you'll be able to use our next generation trading product, Swap."
            />
          </Text>
          <Button nature='primary' fullwidth onClick={verifyIdentity}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.being'
              defaultMessage='Begin Now'
            />
          </Button>
        </Container>
      </ModalBody>
    </Modal>
  )
}

export default AirdropWelcome
