import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { RotateSync } from 'components/RotateSync'

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 15px;
`
const ImageContainer = styled.div`
  position: relative;
  padding-bottom: 57%;
  img {
    position: absolute;
    left: 0;
    top: 0;
  }
`
const ButtonContainer = styled.div`
  margin-top: 20px;
`
const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`

const AuthenticityStep = props => {
  const { authenticity, position, onClose, total } = props
  const { isAuthenticating } = authenticity

  return (
    <Modal position={position} total={total}>
      <ModalHeader onClose={onClose}>
        <FormattedMessage
          id='modals.lockbox.authenticity.title'
          defaultMessage='Verify Device Authenticity'
        />
      </ModalHeader>
      <ModalBody>
        <Content>
          <Text size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockbox.authenticity.content'
              defaultMessage='When prompted on your Lockbox, tap the RIGHT button to let your device connect to your Blockchain Web Wallet. This may take a few moments.'
            />
          </Text>
        </Content>
        <ImageContainer>
          <Image
            name='lockbox-onboard-verify'
            width='100%'
            srcset={{
              'lockbox-onboard-verify2': '2x',
              'lockbox-onboard-verify3': '3x'
            }}
          />
        </ImageContainer>
        <ButtonContainer>
          <Button
            fullwidth
            disabled={isAuthenticating}
            nature={isAuthenticating ? 'gray' : 'success'}
          >
            {isAuthenticating ? (
              <FormattedMessage
                id='modals.lockbox.authenticity.authenticating'
                defaultMessage='Checking Your Device’s Authenticity'
              />
            ) : (
              <FormattedMessage
                id='modals.lockbox.authenticity.success'
                defaultMessage='Success! Click to Continue'
              />
            )}
            {isAuthenticating && (
              <RotateSyncContainer size='16px' color='white' />
            )}
          </Button>
        </ButtonContainer>
      </ModalBody>
    </Modal>
  )
}

export default AuthenticityStep
