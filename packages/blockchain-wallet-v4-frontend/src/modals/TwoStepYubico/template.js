import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import { required } from 'services/FormHelper'

const Code = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;

  & > :first-child { margin-right: 10px; }
  & > :last-child { flex-basis: 300px; }
`

const TwoStepYubico = (props) => {
  const { position, total, closeAll, close, submitting, invalid, ...rest } = props
  const { handleClick } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleClick}>
        <ModalHeader onClose={closeAll}>
          <FormattedMessage id='modals.twostepyubico.title' defaultMessage='Enable 2-Step Verification' />
        </ModalHeader>
        <ModalBody>
          <Code>
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepyubico.explain' defaultMessage='Pair with your yubikey:' />
            </Text>
            <Field name='code' component={TextBox} validate={[required]} />
          </Code>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={300} onClick={close} capitalize>
            <FormattedMessage id='modals.twostepyubico.back' defaultMessage='Go Back' />
          </Link>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='modals.twostepyubico.enable' defaultMessage='Enable 2FA' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'twoStepYubico' })(TwoStepYubico)
