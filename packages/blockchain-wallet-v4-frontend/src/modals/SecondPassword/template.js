import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Form, PasswordBox } from 'components/Form'
import { Button, Modal, ModalHeader, ModalBody, Text } from 'blockchain-info-components'

const SecondPassword = (props) => {
  const { handleClick, secondPassword, position, total } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='safe'>
        <FormattedMessage id='modals.secondpassword.title' defaultMessage='Second password required' />
      </ModalHeader>
      <ModalBody>
        <Form>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.secondpassword.explain' defaultMessage='Please enter your second password' />
          </Text>
          <Form>
            <Field name='secondPassword' component={PasswordBox} />
          </Form>
          <Button nature='secondary' fullwidth onClick={() => handleClick(secondPassword)} validate={[required]}>
            <FormattedMessage id='modals.secondpassword.confirm' defaultMessage='Confirm' />
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

SecondPassword.propTypes = {
  secondPassword: PropTypes.string,
  handleClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'secondPassword' })(SecondPassword)
