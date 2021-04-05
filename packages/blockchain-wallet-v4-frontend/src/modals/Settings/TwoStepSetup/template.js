import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  box-sizing: border-box;

  ${media.atLeastMobile`
    flex-direction: row;
  `}
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.white};
  width: 100%;
  cursor: pointer;
  text-align: center;

  & > * {
    margin-top: 10px;
  }
  & > :last-child {
    margin-bottom: 10px;
  }
  &:hover {
    background-color: ${props => props.theme.grey000};
  }

  ${media.atLeastMobile`
    width: 30%;
  `}
`

const TwoStepSetup = props => {
  const { close, closeAll, position, total, ...rest } = props
  const {
    authType,
    handleDisable,
    handleGoogleAuthenticator,
    handleMobile,
    handleYubico
  } = rest

  return authType !== 0 ? (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <FormattedMessage
          id='modals.twostepsetup.title1'
          defaultMessage='Disable Two Factor Verification'
        />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='modals.twostepsetup'
            defaultMessage='Are you sure to disable two factor authentication ?'
          />
        </Text>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={400} onClick={close}>
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Link>
        <Button nature='warning' onClick={handleDisable}>
          <FormattedMessage
            id='modals.twostepsetup.disable'
            defaultMessage='Disable'
          />
        </Button>
      </ModalFooter>
    </Modal>
  ) : (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <FormattedMessage
          id='modals.twostepsetup.title2'
          defaultMessage='Enable Two-Step Verification'
        />
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='modals.twostepsetup.explain'
              defaultMessage='Protect your wallet from unauthorized access by enabling 2-step Setup.'
            />
          </Text>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='modals.twostepsetup.explain2'
              defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.'
            />
          </Text>
        </TextGroup>
        <Wrapper>
          <Container onClick={handleGoogleAuthenticator}>
            <Image name='google-authenticator' height='100px' />
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.twostepsetup.usegoogle'
                defaultMessage='Google Authenticator'
              />
            </Text>
          </Container>
          <Container onClick={handleYubico}>
            <Image name='yubikey' height='100px' />
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.twostepsetup.useyubikey'
                defaultMessage='Yubikey'
              />
            </Text>
          </Container>
          <Container onClick={handleMobile}>
            <Image name='smartphone' height='100px' />
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.twostepsetup.usemobile'
                defaultMessage='Mobile number'
              />
            </Text>
          </Container>
        </Wrapper>
      </ModalBody>
      <ModalFooter>
        <Link size='13px' weight={400} onClick={close}>
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

export default TwoStepSetup
