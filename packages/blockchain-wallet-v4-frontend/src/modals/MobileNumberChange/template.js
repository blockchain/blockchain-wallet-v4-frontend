import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'
import { Form, PhoneNumberBox } from 'components/Form'
import { validMobileNumber, required } from 'services/FormHelper'
import { spacing } from 'services/StyleService'

const MobileNumber = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 5px;

  & > :last-child { flex-basis: 200px; }
`

const MobileNumberChange = (props) => {
  const { position, total, close, closeAll, submitting, invalid, pristine, countryCode, ...rest } = props
  const { onSubmit } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={onSubmit}>
        <ModalHeader icon='mobile' onClose={closeAll} >
          <FormattedMessage id='modals.mobilenumberchange.title1' defaultMessage='Change Mobile Number' />
        </ModalHeader>
        <ModalBody>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.mobilenumberchange.explain' defaultMessage='Use your mobile phone to receive a one-time-password after a login attempt.' />
          </Text>
          <MobileNumber>
            <Text size='14px' weight={300} style={spacing('pr-5')}>
              <FormattedMessage id='modals.mobilenumberchange.mobile' defaultMessage='Mobile number: ' />
            </Text>
            <Field name='mobileNumber' validate={[validMobileNumber, required]} component={PhoneNumberBox} placeholder='+XX XXX XXX...' countryCode={countryCode} />
          </MobileNumber>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link size='13px' weight={300} onClick={close}>
            <FormattedMessage id='modals.mobilenumberchange.cancel' defaultMessage='Cancel' />
          </Link>
          <Button type='submit' nature='primary' capitalize disabled={submitting || invalid || pristine}>
            <FormattedMessage id='modals.mobilenumberchange.update' defaultMessage='Update' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'mobileNumberChange' })(MobileNumberChange)
