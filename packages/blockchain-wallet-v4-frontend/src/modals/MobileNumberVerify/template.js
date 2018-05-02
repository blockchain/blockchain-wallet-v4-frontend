import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import { required } from 'services/FormHelper'
import { spacing, flex } from 'services/StyleService'

const Code = styled.div`
  width: 60%;
  & > :first-child { flex-basis: 200px; margin-right: 10px; }
`
const Options = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 5px;
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
            <FormattedMessage id='modals.mobilenumberverify.explain' defaultMessage='We have sent an SMS message with a verification code to {number}.' values={{ number: props.mobileNumber }} />
          </Text>
          <Text size='14px' weight={500} style={spacing('mt-10 mb-5')}>
            <FormattedMessage id='modals.mobilenumberverify.explain2' defaultMessage='Enter code:' />
          </Text>
          <Code>
            <Field name='code' validate={[required]} component={TextBox} />
          </Code>
          <Options>
            <Text size='14px' weight={300} style={{ ...flex('row'), ...spacing('pt-5') }}>
              <FormattedMessage id='modals.mobilenumberverify.get_code' defaultMessage="Didn't get the code?&nbsp;" />
              <Link size='14px' weight={300} onClick={handleResend}>
                <FormattedMessage id='modals.mobilenumberverify.resend' defaultMessage='Resend' />
              </Link>
              <FormattedMessage id='modals.mobilenumberverify.get_code' defaultMessage='&nbsp;or&nbsp;' />
              <Link size='14px' weight={300} capitalize onClick={handleChange}>
                <FormattedMessage id='modals.mobilenumberverify.change' defaultMessage='change mobile number' />
              </Link>
            </Text>
          </Options>
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
