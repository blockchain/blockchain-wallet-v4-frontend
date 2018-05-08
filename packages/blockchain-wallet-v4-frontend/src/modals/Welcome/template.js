import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Modal, ModalHeader, ModalBody, Text } from 'blockchain-info-components'

const WelcomeModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  > span {
    color: ${props => props.theme['gray-1']}
  }
`
const Container = styled.div`
  > div:nth-child(2) {
    margin: 10px 0 20px 0;
  }
`

const Welcome = (props) => {
  const { position, total, close, ...rest } = props
  const { handleContinue } = rest

  return (
    <Modal size='medium' position={position} total={total}>
      <WelcomeModalHeader onClose={close} />
      <Image name='v4-welcome' width='100%' />
      <ModalBody>
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage id='modals.welcome.welcome' defaultMessage='Welcome to Blockchain!' />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage id='modals.welcome.thanks' defaultMessage='Thanks for joining over {walletMillions} million Blockchain wallet users in helping create an open, accessible, and fair financial future. Your wallet makes transacting with digital currencies simple and secure. Get started now.' values={{walletMillions: props.walletMillions}} />
          </Text>
          <Button nature='primary' fullwidth uppercase onClick={handleContinue}>
            {/* TODO: trade-status */}
            <FormattedMessage id='modals.welcome.continue' defaultMessage='Request Funds' />
          </Button>
        </Container>
      </ModalBody>
    </Modal>
  )
}

export default Welcome
