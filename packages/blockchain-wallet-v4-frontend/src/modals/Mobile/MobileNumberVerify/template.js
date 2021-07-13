import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
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
import { spacing } from 'services/styles'

export const Code = styled.div`
  width: 60%;
  & > :first-child {
    flex-basis: 200px;
    margin-right: 10px;
  }
`
const OptionsText = styled(Text)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 5px;
  & > * {
    margin-right: 4px;
  }
`
const MobileNumberVerify = props => {
  const {
    close,
    closeAll,
    invalid,
    position,
    submitting,
    total,
    ...rest
  } = props
  const { handleChange, handleResend, handleSubmit } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader icon='mobile' onClose={closeAll}>
          <FormattedMessage
            id='modals.mobilenumberverify.title'
            defaultMessage='Verify Mobile Number'
          />
        </ModalHeader>
        <ModalBody>
          <Text size='14px' weight={500}>
            <FormattedMessage
              id='modals.mobilenumberverify.explain'
              defaultMessage='We have sent an SMS message with a verification code to {number}.'
              values={{ number: props.mobileNumber }}
            />
          </Text>
          <Text size='14px' weight={500} style={spacing('mt-10 mb-5')}>
            <FormattedMessage
              id='modals.mobilenumberverify.explain2'
              defaultMessage='Enter code:'
            />
          </Text>
          <Code>
            <Field name='code' validate={[required]} component={TextBox} />
          </Code>
          <OptionsText size='14px' weight={500}>
            <FormattedMessage
              id='modals.mobilenumberverify.getcode1'
              defaultMessage="Didn't get the code?"
            />
            <Link size='14px' weight={500} onClick={handleResend}>
              <FormattedMessage
                id='modals.mobilenumberverify.resend'
                defaultMessage='Resend'
              />
            </Link>
            <FormattedMessage
              id='modals.mobilenumberverify.getcode2'
              defaultMessage='or'
            />
            <Link size='14px' weight={500} capitalize onClick={handleChange}>
              <FormattedMessage
                id='modals.mobilenumberverify.change'
                defaultMessage=' change mobile number'
              />
            </Link>
          </OptionsText>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={500} onClick={close}>
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Link>
          <Button
            type='submit'
            nature='primary'
            capitalize
            disabled={submitting || invalid}
          >
            <FormattedMessage
              id='modals.mobilenumberverify.verify'
              defaultMessage='Verify'
            />
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
