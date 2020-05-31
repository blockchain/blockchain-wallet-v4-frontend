import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

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

const {
  AIRDROP_ERROR_MODAL,
  ERROR_TYPES
} = model.components.identityVerification

const getErrorMessage = ({ code }) => {
  switch (ERROR_TYPES[code]) {
    case 'INVALID_CAMPAIGN_USER':
      return (
        <FormattedHTMLMessage
          id='modals.sunriverlinkerror.airdrop_not_available'
          defaultMessage="We're sorry, the airdrop program is currently not available where you are."
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
          id='modals.sunriverlinkerror.campaign_has_expired'
          defaultMessage="We're sorry, this specific airdrop is over. Completing your profile will still give you access to higher Swap limits and future airdrops."
        />
      )
    default:
      return (
        <FormattedHTMLMessage
          id='modals.sunriverlinkerror.error'
          defaultMessage='Oops! We had trouble processing your airdrop. Please try again. Server msg: {error}'
          values={{ error: code }}
        />
      )
  }
}

export const AirdropError = ({ position, total, error, closeAll }) => {
  return (
    <Modal size='medium' position={position} total={total}>
      <Header onClose={closeAll}>
        <FormattedMessage
          id='modals.sunriverlinkerror.title'
          defaultMessage='Whoops!'
        />
      </Header>
      <ModalBody>
        <Row size='14px' weight={400}>
          {getErrorMessage(error)}
        </Row>
      </ModalBody>
      <Footer>
        <Button nature='primary' onClick={closeAll}>
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      </Footer>
    </Modal>
  )
}

export default modalEnhancer(AIRDROP_ERROR_MODAL)(AirdropError)
