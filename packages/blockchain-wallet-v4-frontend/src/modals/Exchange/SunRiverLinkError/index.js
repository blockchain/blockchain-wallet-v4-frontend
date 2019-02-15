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

const getErrorMessage = error => {
  switch (error.type) {
    case 'INVALID_CAMPAIGN_USER':
      return (
        <FormattedHTMLMessage
          id='modals.sunriverlinkerror.airdrop_unavailable'
          defaultMessage="We're sorry, the airdrop program is currently not available where you are"
        />
      )
    case 'USER_ALREADY_REGISTERED_CAMPAIGN':
      return (
        <FormattedHTMLMessage
          id='modals.sunriverlinkerror.already_received'
          defaultMessage="Looks like you've already received your airdrop!"
        />
      )
    case 'CAMPAIGN_EXPIRED':
      return (
        <FormattedHTMLMessage
          id='modals.sunriverlinkerror.campaign_expired'
          defaultMessage="We're sorry, the XLM airdrop is over. Complete your profile to be eligible for future airdrops and access trading"
        />
      )
    default:
      return (
        <FormattedHTMLMessage
          id='modals.sunriverlinkerror.error'
          defaultMessage='Oops! We had trouble processing your airdrop. Please try again.'
        />
      )
  }
}

export const SunRiverLinkError = ({ position, total, error, closeAll }) => {
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
          {getErrorMessage(error)}
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
