import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Modal, ModalHeader, ModalBody, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: 350px;

  & > img { display: none; }

  @media(min-width: 576px) { & > img { display: block; } }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0;
  box-sizing: border-box;

  & > :first-child { margin-top: 40px; }

  @media(min-width: 576px) { padding: 0 0 0 50px; }
`

const Welcome = (props) => {
  const { position, total, close, ...rest } = props
  const { handleContinue } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={close}>
        <FormattedMessage id='modals.welcome.title' defaultMessage='Welcome !' />
      </ModalHeader>
      <ModalBody>
        <Wrapper>
          <Image name='rocket' height='100%' />
          <Container>
            <Text size='24px' weight={300}>
              <FormattedMessage id='modals.welcome.welcome' defaultMessage='Welcome !' />
            </Text>
            <TextGroup inline>
              <Text size='14px' weight={300}>
                <FormattedMessage id='modals.welcome.thanks' defaultMessage="Thanks for joining the world's most popular digital currency wallet playform." />
              </Text>
              <Text size='14px' weight={300}>
                <FormattedMessage id='modals.welcome.open' defaultMessage="We're helping to create an open, accessible, and fair financial future, one piece of software at a time." />
              </Text>
            </TextGroup>
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.welcome.purchase' defaultMessage='Get started now by purchaising your first bitcoins !' />
            </Text>
            <Button nature='primary' fullwidth onClick={handleContinue}>
              <FormattedMessage id='modals.welcome.continue' defaultMessage='Get Bitcoin' />
            </Button>
          </Container>
        </Wrapper>
      </ModalBody>
    </Modal>
  )
}

export default Welcome
