import React from 'react'
import { FormattedMessage } from 'react-intl'
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
import { Form, PhoneNumberBox } from 'components/Form'
import { required, validMobileNumber } from 'services/forms'
import { spacing } from 'services/styles'

const MobileNumber = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 5px;

  & > :last-child {
    flex-basis: 200px;
  }
`

const MobileNumberChange = props => {
  const {
    close,
    closeAll,
    handleSubmit,
    invalid,
    position,
    pristine,
    smsNumber,
    submitting,
    total
  } = props

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader icon='mobile' onClose={closeAll}>
          <FormattedMessage
            id='modals.mobilenumberchange.changenumbertitle'
            defaultMessage='Change Mobile Number'
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
              defaultValue={smsNumber}
              errorBottom
            />
          </MobileNumber>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={500} onClick={close}>
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Link>
          <Button
            type='submit'
            nature='primary'
            capitalize
            disabled={submitting || invalid || pristine}
          >
            <FormattedMessage
              id='modals.mobilenumberchange.update'
              defaultMessage='Update'
            />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'mobileNumberChange' })(MobileNumberChange)
