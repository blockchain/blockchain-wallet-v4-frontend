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
  justify-content: space-between;
  align-items: center;
  padding-top: 5px;

  & > :last-child { flex-basis: 140px; }
`

const TwoStepYubico = (props) => {
  const { position, total, closeAll, close, submitting, invalid, ...rest } = props
  const { handleClick } = rest

  return (
    <Modal size='small' position={position} total={total}>
      <ModalHeader icon='settings' onClose={closeAll}>
        <FormattedMessage id='modals.twostepyubico.title' defaultMessage='Two Step - YubiKey' />
      </ModalHeader>
      <ModalBody>
        <Form>
          <Code>
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepyubico.explain' defaultMessage='Pair with your yubikey:' />
            </Text>
            <Field name='code' component={TextBox} placeholder='XXXXXX' validate={[required]} />
          </Code>
        </Form>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={close} capitalize>
          <FormattedMessage id='modals.twostepyubico.back' defaultMessage='Go back' />
        </Link>
        <Button nature='primary' onClick={handleClick} disabled={submitting || invalid}>
          <FormattedMessage id='modals.twostepyubico.enable' defaultMessage='Enable 2FA' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default reduxForm({ form: 'twoStepYubico' })(TwoStepYubico)
