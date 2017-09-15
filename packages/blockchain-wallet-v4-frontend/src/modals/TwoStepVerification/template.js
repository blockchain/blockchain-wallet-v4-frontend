import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Image, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text, TextGroup } from 'blockchain-info-components'

const SelectionWrapper = styled.div`
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
const SelectionContainer = styled.div`
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

const FirstStep = (props) => {
  const { handleClick, position, total, closeAll } = props

  return (
    <Modal size='xlarge' position={position} total={total}>
      <ModalHeader icon='settings' onClose={closeAll} >
        <FormattedMessage id='modals.twostepverification.title' defaultMessage='Enable Two Step' />
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.twostepverification.explain' defaultMessage='Protect your wallet from unauthorized access by enabling 2-step Verification.' />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.twostepverification.explain2' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.' />
          </Text>
        </TextGroup>
        <SelectionWrapper>
          <SelectionContainer onClick={() => handleClick('TwoStepGoogleAuthenticator')}>
            <Image name='google-authenticator' height='100px' />
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepverification.use_google' defaultMessage='Google Authenticator' />
            </Text>
          </SelectionContainer>
          <SelectionContainer onClick={() => handleClick('TwoStepYubico')}>
            <Image name='yubikey' height='100px' />
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepverification.use_yubikey' defaultMessage='Yubikey' />
            </Text>
          </SelectionContainer>
          <SelectionContainer onClick={() => handleClick('TwoStepMobile')}>
            <Image name='smartphone' height='100px' />
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepverification.use_mobile' defaultMessage='Mobile number' />
            </Text>
          </SelectionContainer>
        </SelectionWrapper>
      </ModalBody>
      <ModalFooter>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.twostepverification.cancel' defaultMessage='Cancel' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

export default FirstStep
