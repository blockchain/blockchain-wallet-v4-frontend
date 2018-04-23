import React from 'react'
import PropTypes from 'prop-types'
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

  & > :first-child { flex-basis: 200px; margin-right: 10px; }
`
const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & > * { margin-right: 5px; ]}
`

const MobileNumberVerify = (props) => {
  const { position, total, close, closeAll, submitting, invalid, ...rest } = props
  const { onSubmit, handleChange, handleResend } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={onSubmit}>
        <ModalHeader icon='mobile' onClose={closeAll} >
          <FormattedMessage id='modals.mobilenumberverify.title' defaultMessage='Verify Mobile Number' />
        </ModalHeader>
        <ModalBody>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.mobilenumberverify.explain' defaultMessage='We have sent your mobile phone an SMS message with a verification code. Enter the code below to verify your mobile phone number.' />
          </Text>
          <Code>
            <Field name='code' validate={[required]} component={TextBox} />
            <Options>
              <Link size='13px' weight={300} onClick={handleResend}>
                <FormattedMessage id='modals.mobilenumberverify.resend' defaultMessage='Resend' />
              </Link>
              <Text size='13px' weight={300} color='brand-secondary'>|</Text>
              <Link size='13px' weight={300} capitalize onClick={handleChange}>
                <FormattedMessage id='modals.mobilenumberverify.change' defaultMessage='Change mobile number' />
              </Link>
            </Options>
          </Code>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={300} onClick={close}>
            <FormattedMessage id='modals.mobilenumberverify.cancel' defaultMessage='Cancel' />
          </Link>
          <Button type='submit' nature='primary' capitalize disabled={submitting || invalid}>
            <FormattedMessage id='modals.mobilenumberverify.verify' defaultMessage='Verify' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

MobileNumberVerify.propTypes = {
  mobileNumber: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired
}

export default reduxForm({ form: 'mobileNumberVerify' })(MobileNumberVerify)
