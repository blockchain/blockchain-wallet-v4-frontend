import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { required } from 'services/FormHelper'
import { Form, PasswordBox } from 'components/Form'
import { Button, Modal, Text } from 'blockchain-info-components'

const SecondPassword = (props) => {
  const { handleClick, secondPassword, ...rest } = props

  return (
    <Modal {...rest} icon='safe' title='Second password' size='large'>
      <Text size='14px' weight={500}>
        <FormattedMessage id='modals.secondpassword.explain' defaultMessage='Please enter your second password' />
      </Text>
      <Form>
        <Field name='secondPassword' component={PasswordBox} />
      </Form>
      <Button nature='secondary' fullwidth onClick={() => handleClick(secondPassword)} validate={[required]}>
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
