import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  box-sizing: border-box;

  @media(min-width: 540px) {
    flex-direction: row;
  }
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['white']};
  width: 100%;
  cursor: pointer;
  text-align: center;

  & > * { margin-top: 10px; }
  & > :last-child { margin-bottom: 10px; }
  &:hover { background-color: ${props => props.theme['gray-1']}; }

  @media(min-width: 540px) { width: 30%; }
`

const TwoStepSetup = (props) => {
  const { position, total, close, closeAll, ...rest } = props
  const { handleGoogleAuthenticator, handleMobile, handleYubico, handleDisable, authType } = rest

  return authType !== 0 ? (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll} >
        <FormattedMessage id='modals.twostepsetup.title1' defaultMessage='Disable Two Factor Verification' />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={300}>
          <FormattedMessage id='modals.twostepsetup' defaultMessage='Are you sure to disable two factor authentication ?' />
        </Text>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.twostepsetup.cancel' defaultMessage='Cancel' />
        </Link>
        <Button nature='logout' onClick={handleDisable}>
          <FormattedMessage id='modals.twostepsetup.disable' defaultMessage='Disable' />
        </Button>
      </ModalFooter>
    </Modal>
  ) : (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll} >
        <FormattedMessage id='modals.twostepsetup.title2' defaultMessage='Enable Two-factor Authentication' />
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.twostepsetup.explain' defaultMessage='Protect your wallet from unauthorized access by enabling 2-step Setup.' />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.twostepsetup.explain2' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.' />
          </Text>
        </TextGroup>
        <Wrapper>
          <Container onClick={handleGoogleAuthenticator}>
            <Image name='google-authenticator' height='100px' />
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepsetup.use_google' defaultMessage='Google Authenticator' />
            </Text>
          </Container>
          <Container onClick={handleYubico}>
            <Image name='yubikey' height='100px' />
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepsetup.use_yubikey' defaultMessage='Yubikey' />
            </Text>
          </Container>
          <Container onClick={handleMobile}>
            <Image name='smartphone' height='100px' />
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepsetup.use_mobile' defaultMessage='Mobile number' />
            </Text>
          </Container>
        </Wrapper>
      </ModalBody>
      <ModalFooter>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.twostepsetup.cancel' defaultMessage='Cancel' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

export default TwoStepSetup
