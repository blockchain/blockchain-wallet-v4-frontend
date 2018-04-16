import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, PasswordInput, Text } from 'blockchain-info-components'

const SecondPassword = (props) => {
  const { position, total, close, ...rest } = props
  const { handleClick, handleChange, value } = rest

  return (
    <Modal size='medium' position={position} total={total} closeButton={false}>
      <ModalHeader icon='safe' onClose={close}>
        <FormattedMessage id='modals.secondpassword.title' defaultMessage='Second password required' />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={500}>
          <FormattedMessage id='modals.secondpassword.explain' defaultMessage='Please enter your second password' />
        </Text>
        <PasswordInput value={value} onChange={handleChange} />
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.secondpassword.cancel' defaultMessage='Cancel' />
        </Link>
        <Button nature='primary' onClick={handleClick}>
          <FormattedMessage id='modals.secondpassword.confirm' defaultMessage='Confirm' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

SecondPassword.propTypes = {
  secondPassword: PropTypes.string,
  handleClick: PropTypes.func.isRequired
}

export default SecondPassword
