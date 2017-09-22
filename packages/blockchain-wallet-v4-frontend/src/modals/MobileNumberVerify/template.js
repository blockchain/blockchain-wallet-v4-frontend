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
  const { mobileNumber, handleChangeMobileNumber, handleResend, handleValidate, handleCancel } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='mobile' onClose={closeAll} >
        <FormattedMessage id='modals.mobilenumberverify.title' defaultMessage='Verify Mobile Number' />
      </ModalHeader>
      <ModalBody>
        <Form>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.mobilenumberverify.explain' defaultMessage='We have sent to {number} an SMS message with a verification code.' values={{ number: mobileNumber }} />
          </Text>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.mobilenumberverify.explain2' defaultMessage='Enter code :' />
          </Text>
          <Code>
            <Field name='code' validate={[required]} component={TextBox} />
            <Options>
              <Link size='13px' weight={300} onClick={handleResend}>
                <FormattedMessage id='modals.mobilenumberverify.resend' defaultMessage='Resend' />
              </Link>
              <Text size='13px' weight={300} color='brand-secondary'>|</Text>
              <Link size='13px' weight={300} capitalize onClick={handleChangeMobileNumber}>
                <FormattedMessage id='modals.mobilenumberverify.change' defaultMessage='Change mobile number' />
              </Link>
            </Options>
          </Code>
        </Form>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={handleCancel}>
          <FormattedMessage id='modals.mobilenumberverify.cancel' defaultMessage='Cancel' />
        </Link>
        <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleValidate}>
          <FormattedMessage id='modals.mobilenumberverify.verify' defaultMessage='Verify' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

MobileNumberVerify.propTypes = {
  mobileNumber: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired,
  handleValidate: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
}

export default reduxForm({ form: 'mobileNumberVerify' })(MobileNumberVerify)
