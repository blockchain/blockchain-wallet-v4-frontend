import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Link, ModalBody, ModalFooter, ModalHeader, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import TextBox from 'components/Form/TextBox'
import { required } from 'services/forms'
import { spacing } from 'services/styles'

import { MobileModalProps } from '../types'

export const Code = styled.div`
  width: 60%;
  & > :first-child {
    flex-basis: 200px;
    margin-right: 10px;
  }
`

type Props = {
  handleChange: () => void
  handleResend: () => void
  mobileNumber: string
} & MobileModalProps

const MobileNumberVerify = ({
  handleChange,
  handleClose,
  handleResend,
  handleSubmit,
  invalid,
  mobileNumber,
  submitting
}: InjectedFormProps<{}, Props> & Props) => {
  return (
    <Form onSubmit={handleSubmit}>
      <ModalHeader icon='mobile' onClose={handleClose}>
        <FormattedMessage
          id='modals.mobilenumberverify.title'
          defaultMessage='Verify Mobile Number'
        />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={500}>
          <FormattedMessage
            id='modals.mobilenumberverify.explain'
            defaultMessage='We have sent an SMS message with a verification code to {mobileNumber}.'
            values={{ mobileNumber }}
          />
        </Text>
        <Text size='14px' weight={500} style={spacing('mt-10 mb-5')}>
          <FormattedMessage id='modals.mobilenumberverify.explain2' defaultMessage='Enter code:' />
        </Text>
        <Code>
          <Field name='code' validate={[required]} component={TextBox} />
        </Code>
        <Text size='14px' weight={500}>
          <FormattedMessage
            id='modals.mobilenumberverify.getcode1'
            defaultMessage="Didn't get the code?"
          />{' '}
          <Link size='14px' weight={500} onClick={handleResend}>
            <FormattedMessage id='modals.mobilenumberverify.resend' defaultMessage='Resend' />
          </Link>{' '}
          <FormattedMessage id='modals.mobilenumberverify.getcode2' defaultMessage='or' />{' '}
          <Link size='14px' weight={500} capitalize onClick={handleChange}>
            <FormattedMessage
              id='modals.mobilenumberverify.change'
              defaultMessage=' change mobile number'
            />
          </Link>
        </Text>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Button
          type='submit'
          nature='empty-blue'
          capitalize
          disabled={submitting}
          data-e2e='VerifyMobileNumberCancel'
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Button>
        <Button
          type='submit'
          nature='primary'
          capitalize
          disabled={submitting || invalid}
          data-e2e='VerifyMobileNumberConfirm'
        >
          <FormattedMessage id='modals.mobilenumberverify.verify' defaultMessage='Verify' />
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default reduxForm<{}, Props>({ form: 'mobileNumberVerify' })(MobileNumberVerify)
