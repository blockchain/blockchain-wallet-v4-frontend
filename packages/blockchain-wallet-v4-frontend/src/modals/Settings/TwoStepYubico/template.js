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
import { required } from 'services/forms'

const Code = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;

  & > :first-child {
    margin-right: 10px;
  }
  & > :last-child {
    flex-basis: 300px;
  }
`

const TwoStepYubico = props => {
  const {
    close,
    closeAll,
    handleSubmit,
    invalid,
    position,
    submitting,
    total
  } = props

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage
            id='modals.twostepyubico.title'
            defaultMessage='Enable Two-Step Verification'
          />
        </ModalHeader>
        <ModalBody>
          <Code>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.twostepyubico.explain'
                defaultMessage='Pair with your yubikey:'
              />
            </Text>
            <Field name='code' component={TextBox} validate={[required]} />
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
              id='modals.twostepyubico.enable'
              defaultMessage='Enable 2FA'
            />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'twoStepYubico' })(TwoStepYubico)
