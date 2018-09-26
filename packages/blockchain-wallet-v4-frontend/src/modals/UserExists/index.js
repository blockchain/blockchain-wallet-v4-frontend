import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { model } from 'data'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import {
  Modal,
  ModalBody,
  ModalFooter,
  Link,
  Text,
  Button
} from 'blockchain-info-components'

const Header = styled(Text)`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 20px;
`
const Row = styled(Text)`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`
const TextLink = styled(Link)`
  font-size: 14px;
  font-weight: 300;
`
const Footer = styled(ModalFooter)`
  > div {
    justify-content: flex-end;
  }
`
const CloseButton = styled(Button)`
  border: none;
  margin-right: 15px;
`

const { USER_EXISTS_MODAL } = model.components.identityVerification

export const UserExists = ({ position, total, email, close }) => {
  return (
    <Modal size='medium' position={position} total={total}>
      <ModalBody>
        <Header>
          <FormattedMessage
            id='modals.userexists.title'
            defaultMessage='Email Address Already Used'
          />
        </Header>
        <Row size='14px' weight={300}>
          <FormattedHTMLMessage
            id='modals.userexists.emailused'
            defaultMessage='Looks like the email <b>{email}</b> has already been used on a different Blockchain wallet.'
            values={{ email }}
          />
        </Row>
        <Row size='14px' weight={300}>
          <FormattedHTMLMessage
            id='modals.userexists.kycnotcomplete'
            defaultMessage="If you didn't complete your identity verification on another Wallet, <b>change your email address</b> to continue your process."
          />
        </Row>
        <Row size='14px' weight={300}>
          <FormattedMessage
            id='modals.userexists.kyccomplete'
            defaultMessage="If you have completed your verification you won't be able to get identity verified again."
          />
          &nbsp;
          <TextLink target='_blank' href=''>
            <FormattedMessage
              id='modals.userexists.learnmore'
              defaultMessage='Learn more'
            />
          </TextLink>
        </Row>
      </ModalBody>
      <Footer>
        <CloseButton onClick={close}>
          <FormattedMessage
            id='modals.userexists.close'
            defaultMessage='Close'
          />
        </CloseButton>
        <LinkContainer to='/security-center'>
          <Button nature='primary'>
            <FormattedMessage
              id='modals.userexists.changeemail'
              defaultMessage='Change Email'
            />
          </Button>
        </LinkContainer>
      </Footer>
    </Modal>
  )
}

UserExists.propTypes = {
  email: PropTypes.string.isRequired
}

const enhance = compose(
  modalEnhancer(USER_EXISTS_MODAL),
  connect(getData)
)

export default enhance(UserExists)
