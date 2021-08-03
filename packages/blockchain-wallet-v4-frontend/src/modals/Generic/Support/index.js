import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Link, Modal, Text } from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 435px;
  padding: 48px 32px 0 32px;
  box-sizing: border-box;
  text-align: center;
`
const Title = styled(Text)`
  margin-bottom: 16px;
  font-size: 26px;
  b {
    font-weight: 500;
    color: ${(props) => props.theme.success};
  }
`
const Message = styled(Text)`
  margin-bottom: 24px;
  font-size: 18px;
`
const BottomImage = styled(Image)`
  width: 100%;
  align-self: flex-end;
`
const FooterLink = styled(Link)`
  height: auto;
  width: 100%;
  margin-bottom: 32px;
`
const FooterButton = styled(Button)`
  height: 100%;
  font-size: 18px;
  font-weight: 500;
  padding: 16px 0;
`

export const Support = ({ position, total }) => (
  <Modal size='small' position={position} total={total}>
    <Body data-e2e='swapGetStarted'>
      <Title size='20px'>
        <FormattedMessage defaultMessage='Need some help?' id='copy.need_some_help' />
      </Title>
      <Message>
        <FormattedMessage
          defaultMessage='Our Blockchain Support Team is standing by.'
          id='modals.support.our_support'
        />
      </Message>
      <FooterLink
        href='https://blockchain.zendesk.com/hc/en-us/requests/new?ticket_form_id=360000180551'
        target='_blank'
      >
        <FooterButton nature='primary' size='20px' fullwidth>
          <FormattedMessage defaultMessage='Contact Support' id='buttons.contact_support' />
        </FooterButton>
      </FooterLink>
      <BottomImage name='identity-verification' />
    </Body>
  </Modal>
)

export default modalEnhancer('SUPPORT_MODAL')(Support)
