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
  justify-content: center;
  align-items: center;
  padding-top: 5px;

  & > :last-child { flex-basis: 150px; }
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
  const { mobileNumber, handleChangeMobileNumber, handleResend, handleVerify } = rest

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
          <Code>
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.mobilenumberverify.explain2' defaultMessage='Verification code :' />
            </Text>
            <Field name='code' validate={[required]} component={TextBox} />
          </Code>
          <Options>
            <Link size='13px' weight={300} onClick={handleResend}>
              <FormattedMessage id='modals.mobilenumberverify.resend' defaultMessage='Resend' />
            </Link>
            <Text size='13px' weight={300} color='brand-secondary'>|</Text>
            <Link size='13px' weight={300} capitalize onClick={handleChangeMobileNumber}>
              <FormattedMessage id='modals.mobilenumberverify.change' defaultMessage='Change mobile number' />
            </Link>
          </Options>
        </Form>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.mobilenumberverify.cancel' defaultMessage='Cancel' />
        </Link>
        <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleVerify}>
          <FormattedMessage id='modals.mobilenumberverify.verify' defaultMessage='Verify' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

MobileNumberVerify.propTypes = {
  mobileNumber: PropTypes.string.isRequired,
  handleChangeMobileNumber: PropTypes.func.isRequired,
  handleResend: PropTypes.func.isRequired,
  handleVerify: PropTypes.func.isRequired
}

export default reduxForm({ form: 'mobileNumberVerify' })(MobileNumberVerify)
