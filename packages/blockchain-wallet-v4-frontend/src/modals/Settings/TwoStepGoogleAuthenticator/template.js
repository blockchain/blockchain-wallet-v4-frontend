import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import QRCodeWrapper from 'components/QRCode/Wrapper'
import { required } from 'services/forms'

const QRCode = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  padding: 30px 0;
`
const Code = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;

  & > :last-child {
    flex-basis: 150px;
  }
`

const TwoStepGoogleAuthenticator = props => {
  const {
    close,
    closeAll,
    invalid,
    position,
    submitting,
    total,
    ...rest
  } = props
  const { googleAuthenticatorSecretUrl, handleSubmit } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage
            id='modals.twostepgoogleauthenticator.title'
            defaultMessage='Enable Two-Step Verification'
          />
        </ModalHeader>
        <ModalBody>
          <QRCode>
            <QRCodeWrapper value={googleAuthenticatorSecretUrl} size={256} />
          </QRCode>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='modals.twostepgoogleauthenticator.explain'
              defaultMessage='Scan this QR code with your Google Authenticator app on your mobile phone (download for iOS or Android).'
            />
          </Text>
          <Text size='14px' weight={400}>
            <FormattedMessage
              id='modals.twostepgoogleauthenticator.explain2'
              defaultMessage='Once scanned you will be presented with a random 6 digit number.'
            />
          </Text>
          <Code>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.twostepgoogleauthenticator.explain3'
                defaultMessage='Enter that number to finish the setup process:'
              />
            </Text>
            <Field
              name='code'
              component={TextBox}
              placeholder='XXXXXX'
              validate={[required]}
            />
          </Code>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={400} onClick={close} capitalize>
            <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
          </Link>
          <Button
            type='submit'
            nature='primary'
            disabled={submitting || invalid}
          >
            <FormattedMessage
              id='modals.twostepgoogleauthenticator.enable'
              defaultMessage='Enable 2FA'
            />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'twoStepGoogleAuthenticator' })(
  TwoStepGoogleAuthenticator
)
