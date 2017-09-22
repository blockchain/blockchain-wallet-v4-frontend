import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'
import { Form, PhoneNumberBox } from 'components/Form'
import { validMobileNumber } from 'services/FormHelper'

const MobileNumber = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 5px;

  & > :last-child { flex-basis: 200px; }
`

const MobileNumberChange = (props) => {
  const { position, total, closeAll, submitting, invalid, ...rest } = props
  const { handleUpdate, handleCancel } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='mobile' onClose={closeAll} >
        <FormattedMessage id='modals.mobilenumberchange.title1' defaultMessage='Change Mobile Number' />
      </ModalHeader>
      <ModalBody>
        <Form>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.mobilenumberchange.explain' defaultMessage='Use your mobile phone to receive a one-time-password after a login attempt.' />
          </Text>
          <MobileNumber>
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.mobilenumberchange.mobile' defaultMessage='Mobile number : ' />
            </Text>
            <Field name='mobileNumber' validate={[validMobileNumber]} component={PhoneNumberBox} placeholder='+XX XXX XXX...' />
          </MobileNumber>
        </Form>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={handleCancel}>
          <FormattedMessage id='modals.mobilenumberchange.cancel' defaultMessage='Cancel' />
        </Link>
        <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleUpdate}>
          <FormattedMessage id='modals.mobilenumberchange.update' defaultMessage='Update' />
        </Button>
      </ModalFooter>

    </Modal>
  )
}

MobileNumberChange.propTypes = {
  handleUpdate: PropTypes.func.isRequired
}

export default reduxForm({ form: 'mobileNumberChange' })(MobileNumberChange)
