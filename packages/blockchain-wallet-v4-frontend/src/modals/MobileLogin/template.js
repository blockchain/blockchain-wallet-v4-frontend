import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRReader from 'components/QRReader'

import { Badge, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const QRCodeContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 15px;
  & > section > video { width: 100%; }

  @media(min-width: 768px) {
    width: 50%;
  }
`
const InstructionsContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 15px;
  flex-direction: column;
  justify-content: flex-start;

  @media(min-width: 768px) {
    width: 50%;
  }
`
const InstructionList = styled.ol`
  padding-left: 10px;
`
const Instruction = styled.li`
  font-family: 'Montserrat',sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: ${props => props.theme['gray-6']}
`
const BadgesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const MobileLogin = (props) => {
  const { position, total, close, closeAll, ...rest } = props
  const { handleScan, handleError } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll} >
        <FormattedMessage id='modals.mobilelogin.title' defaultMessage='Mobile login' />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={300}>
          <FormattedMessage id='modals.mobilelogin.explain' defaultMessage='Follow these steps to log into your web wallet using your mobile device' />
        </Text>
        <Container>
          <QRCodeContainer>
            <QRReader onScan={handleScan} onError={handleError} />
          </QRCodeContainer>
          <InstructionsContainer>
            <Text size='16px' weight={400} color='brand-primary'>
              <FormattedMessage id='modals.mobilelogin.login' defaultMessage='Logging in with Mobile' />
            </Text>
            <InstructionList>
              <Instruction>
                <FormattedMessage id='modals.mobilelogin.openapp' defaultMessage='Open the Blockchain app on your mobile device ' />
              </Instruction>
              <Instruction>
                <FormattedMessage id='modals.mobilelogin.tapweb' defaultMessage="Select 'Log in to Web Wallet' from your wallet's side menu" />
              </Instruction>
              <Instruction>
                <FormattedMessage id='modals.mobilelogin.showqr' defaultMessage="Select 'Show QR Code'" />
              </Instruction>
              <Instruction>
                <FormattedMessage id='modals.mobilelogin.scan' defaultMessage="Using your computer's camera, scan the QR code that appears" />
              </Instruction>
            </InstructionList>
          </InstructionsContainer>
        </Container>
        <BadgesContainer>
          <Badge type='applestore' />
          <Badge type='googleplay' />
        </BadgesContainer>
      </ModalBody>
      <ModalFooter>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.mobilelogin.cancel' defaultMessage='Cancel' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

MobileLogin.propTypes = {
  handleScan: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired
}

export default MobileLogin
