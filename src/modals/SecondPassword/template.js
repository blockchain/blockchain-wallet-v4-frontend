import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'

import { required } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { Form, PasswordBox } from 'components/generic/Form'
import Modal from 'components/generic/Modal'

const SecondPassword = (props) => {
  const { handleClick, secondPassword, ...rest } = props

  return (
    <Modal {...rest} icon='icon-safe-secure' title='Second password' size='large'>
      <Text id='modals.secondpassword.explain' text='Please enter your second password' small light />
      <Form>
        <Field name='secondPassword' component={PasswordBox} />
      </Form>
      <SecondaryButton fullwidth onClick={() => handleClick(secondPassword)} validate={[required]}>
        <Text id='modals.secondpassword.confirm' text='Confirm' small light white />
      </SecondaryButton>
    </Modal>
  )
}

SecondPassword.propTypes = {
  secondPassword: PropTypes.string,
  handleClick: PropTypes.func.isRequired
}

export default SecondPassword
