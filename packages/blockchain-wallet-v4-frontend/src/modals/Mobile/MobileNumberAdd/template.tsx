import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { isValidNumber } from 'libphonenumber-js'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { Button, ModalBody, ModalFooter, ModalHeader, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import PhoneNumberBox from 'components/Form/PhoneNumberBox'
import { getUserCountryCode } from 'data/modules/profile/selectors'
import { required } from 'services/forms'
import { spacing } from 'services/styles'

import { MobileNumber } from '../styles'
import { MobileModalProps } from '../types'

const validMobileNumber = (value) =>
  isValidNumber(value) ? undefined : (
    <FormattedMessage id='formhelper.invalidmobilenumber' defaultMessage='Invalid mobile number' />
  )

const MobileNumberAdd = ({
  handleClose,
  handleSubmit,
  invalid,
  pristine,
  submitting
}: InjectedFormProps<{}, MobileModalProps> & MobileModalProps) => {
  const countryCode = useSelector(getUserCountryCode).getOrElse('US')

  return (
    <Form onSubmit={handleSubmit}>
      <ModalHeader icon='mobile' onClose={handleClose}>
        <FormattedMessage
          id='modals.mobilenumberchange.addnumbertitle'
          defaultMessage='Add Mobile Number'
        />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='modals.mobilenumberchange.explain'
            defaultMessage='Use your mobile phone to receive a one-time-password after a login attempt.'
          />
        </Text>
        <MobileNumber>
          <Text size='14px' weight={400} style={spacing('pr-5')}>
            <FormattedMessage
              id='modals.mobilenumberchange.mobile'
              defaultMessage='Mobile number: '
            />
          </Text>
          <Field
            name='mobileNumber'
            validate={[validMobileNumber, required]}
            component={PhoneNumberBox}
            errorBottom
            countyCode={countryCode}
          />
        </MobileNumber>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Button
          nature='empty-blue'
          onClick={handleClose}
          disabled={submitting}
          data-e2e='AddMobileNumberCancel'
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Button>
        <Button
          type='submit'
          nature='primary'
          capitalize
          disabled={submitting || invalid || pristine}
          data-e2e='AddMobileNumberConfirm'
        >
          <FormattedMessage id='modals.mobilenumberchange.update' defaultMessage='Update' />
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default reduxForm<{}, MobileModalProps>({ form: 'mobileNumberAdd' })(MobileNumberAdd)
