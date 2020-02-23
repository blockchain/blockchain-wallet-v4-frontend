import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const Row = styled.div`
  display: flex;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const WalletTools = styled(Column)`
  padding: 32px 24px;
  width: 50%;
  align-items: center;
  > img:first-child {
    margin-bottom: 16px;
  }
`

const WalletTourModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  padding-top: 28px;
  z-index: 1;
  > span {
    color: ${({ theme }) => theme['gray-6']};
    width: 16px;
    height: 16px;
  }
`

const WalletTourModalBody = styled(ModalBody)`
  padding: 48px;

  span {
    line-height: 24px;
  }
`

const BodyHeader = styled(Row)`
  align-items: center;

  span {
    margin-left: 8px;
  }
`

const WalletToolsContainer = styled(Column)`
  margin-bottom: 16px;
`

const SecureStore = styled(WalletTools)`
  border-right: 1px solid ${({ theme }) => theme['gray-1']};
  border-bottom: 1px solid ${({ theme }) => theme['gray-1']};
`

const Transaction = styled(WalletTools)`
  border-bottom: 1px solid ${({ theme }) => theme['gray-1']};
`

const BuySell = styled(WalletTools)`
  border-right: 1px solid ${({ theme }) => theme['gray-1']};
`

const Container = styled.div`
  > div:nth-child(2) {
    margin: 16px 0 32px 0;
  }

  > button {
    padding: 8px 16px;
    height: 48px;

    &:last-child {
      margin-top: 16px;
    }
  }
`

const WalletTour = props => {
  const { position, total, onSkipTour, onTakeTour } = props

  return (
    <Modal
      size='medium'
      position={position}
      total={total}
      dataE2e='infoModalWalletTour'
    >
      <WalletTourModalHeader onClose={onSkipTour} />
      <WalletTourModalBody>
        <Container>
          <BodyHeader>
            <Image name='intro-hand' width='32px' height='32px' />
            <Text color='gray-8' size='20px' weight={600}>
              <FormattedMessage
                id='modals.wallet.tour.wallet.tour'
                defaultMessage='Welcome to Blockchain!'
              />
            </Text>
          </BodyHeader>
          <Text color='gray-8' size='16px' weight={400}>
            <FormattedMessage
              id='modals.wallet.tour.desc'
              defaultMessage="Discover your Wallet's tools and features by taking a quick tour."
            />
          </Text>
          <WalletToolsContainer>
            <Row>
              <SecureStore>
                <Image name='intro-lock' width='32px' height='32px' />
                <Text weight={500}>
                  <FormattedMessage
                    id='modals.wallet.tour.securely-store'
                    defaultMessage='Securely Store'
                  />
                </Text>
              </SecureStore>
              <Transaction>
                <Image name='intro-send' width='32px' height='32px' />
                <Text weight={500}>
                  <FormattedMessage
                    id='modals.wallet.tour.sendrequest'
                    defaultMessage='Send/Request'
                  />
                </Text>
              </Transaction>
            </Row>
            <Row>
              <BuySell>
                <Icon name='cart-filled' color='blue600' size='32px' />
                <Text weight={500}>
                  <FormattedMessage
                    id='modals.wallet.tour.buy-sell'
                    defaultMessage='Buy & Sell'
                  />
                </Text>
              </BuySell>
              <WalletTools>
                <Image name='intro-swap' width='32px' height='32px' />
                <Text weight={500}>
                  <FormattedMessage
                    id='modals.wallet.tour.trade'
                    defaultMessage='Trade'
                  />
                </Text>
              </WalletTools>
            </Row>
          </WalletToolsContainer>
          <Button
            nature='primary'
            fullwidth
            onClick={onTakeTour}
            data-e2e='takeTourButton'
            size='16px'
          >
            <FormattedMessage
              id='modals.wallet.tour.take-tour-button'
              defaultMessage='Take The Tour'
            />
          </Button>
          <Button
            fullwidth
            onClick={onSkipTour}
            data-e2e='showWalletTourAlert'
            size='16px'
          >
            <FormattedMessage
              id='modals.wallet.tour.later-button'
              defaultMessage='Maybe Later'
            />
          </Button>
        </Container>
      </WalletTourModalBody>
    </Modal>
  )
}

export default WalletTour
