import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import React from 'react'

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PasswordInput,
  Text
} from 'blockchain-info-components'
import { Form } from 'components/Form'

const SecondPassword = props => {
  const { position, total, close, ...rest } = props
  const { handleSubmit, handleChange, value } = rest

  return (
    <Modal size='medium' position={position} total={total} closeButton={false}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader icon='safe' onClose={close}>
          <FormattedMessage
            id='modals.secondpassword.title'
            defaultMessage='Second password required'
          />
        </ModalHeader>
        <ModalBody>
          <Text size='14px' weight={500}>
            <FormattedMessage
              id='modals.secondpassword.explain'
              defaultMessage='Please enter your second password'
            />
          </Text>
          <PasswordInput
            value={value}
            onChange={handleChange}
            data-e2e='secondPasswordModalInput'
          />
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link
            size='13px'
            weight={400}
            onClick={close}
            data-e2e='secondPasswordModalCancelButton'
          >
            <FormattedMessage
              id='modals.secondpassword.cancel'
              defaultMessage='Cancel'
            />
          </Link>
          <Button
            type='submit'
            nature='primary'
            onClick={handleSubmit}
            data-e2e='secondPasswordModalConfirmButton'
          >
            <FormattedMessage
              id='modals.secondpassword.confirm'
              defaultMessage='Confirm'
            />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

SecondPassword.propTypes = {
  secondPassword: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'secondPassword' })(SecondPassword)
