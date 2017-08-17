import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Form, Modal, PasswordBox } from 'blockchain-info-components'

const SecondPassword = (props) => {
  const { handleClick, secondPassword, ...rest } = props

  return (
    <Modal {...rest} icon='icon-safe-secure' title='Second password' size='large'>
      <FormattedMessage id='modals.secondpassword.explain' defaultMessage='Please enter your second password' />
      <Form>
        <Field name='secondPassword' component={PasswordBox} />
      </Form>
      <Button type='secondary' fullwidth onClick={() => handleClick(secondPassword)} validate={[required]}>
        <FormattedMessage id='modals.secondpassword.confirm' defaultMessage='Confirm' />
      </Button>
    </Modal>
  )
}

SecondPassword.propTypes = {
  secondPassword: PropTypes.string,
  handleClick: PropTypes.func.isRequired
}

export default SecondPassword
