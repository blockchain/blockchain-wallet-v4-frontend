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
const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  & > * { margin-right: 5px; ]}
`

const TwoStepMobile = (props) => {
  const { handleClick, position, total, closeAll, close, submitting, invalid } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='settings' onClose={closeAll}>
        <FormattedMessage id='modals.twostepmobile.title' defaultMessage='Two Step - Mobile' />
      </ModalHeader>
      <ModalBody>
        <Form>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.twostepmobile.explain' defaultMessage='We have sent your mobile phone an SMS message with a verification code. ' />
          </Text>
          <Code>
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.twostepmobile.explain2' defaultMessage='Enter the code to verify your mobile phone number:' />
            </Text>
            <Field name='code' component={TextBox} placeholder='XXXXXX' validate={[required]} />
          </Code>
          <Options>
            <Link size='13px' weight={300}>
              <FormattedMessage id='modals.twostepmobile.resend' defaultMessage='Resend' />
            </Link>
            <Text size='13px' weight={300} color='brand-secondary'>|</Text>
            <Link size='13px' weight={300} capitalize>
              <FormattedMessage id='modals.twostepmobile.change' defaultMessage='Change mobile number' />
            </Link>
          </Options>
        </Form>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={close} capitalize>
          <FormattedMessage id='modals.twostepmobile.back' defaultMessage='Go back' />
        </Link>
        <Button nature='primary' onClick={handleClick} disabled={submitting || invalid}>
          <FormattedMessage id='modals.twostepmobile.enable' defaultMessage='Verify' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default reduxForm({ form: 'TwoStepMobile' })(TwoStepMobile)
