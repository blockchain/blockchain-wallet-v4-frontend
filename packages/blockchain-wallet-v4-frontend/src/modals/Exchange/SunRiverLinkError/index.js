import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Text,
  Button
} from 'blockchain-info-components'

const Row = styled(Text)`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`
const Footer = styled(ModalFooter)`
  > div {
    justify-content: flex-end;
  }
`
const Header = styled(ModalHeader)`
  font-size: 18px;
`

const { SUNRIVER_LINK_ERROR_MODAL } = model.components.identityVerification

export const SunRiverLinkError = ({ position, total, email, closeAll }) => {
  return (
    <Modal size='medium' position={position} total={total}>
      <Header onClose={closeAll}>
        <FormattedMessage
          id='modals.sunriverlinkerror.title'
          defaultMessage='Whoops!'
        />
      </Header>
      <ModalBody>
        <Row size='14px' weight={300}>
          <FormattedHTMLMessage
            id='modals.sunriverlinkerror.linkused'
            defaultMessage='Your referral link is either invalid or has already been used to claim XLM.'
          />
        </Row>
      </ModalBody>
      <Footer>
        <Button nature='primary' onClick={closeAll}>
          <FormattedMessage
            id='modals.sunriverlinkerror.continue'
            defaultMessage='Continue'
          />
        </Button>
      </Footer>
    </Modal>
  )
}

export default modalEnhancer(SUNRIVER_LINK_ERROR_MODAL)(SunRiverLinkError)
