import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'

const AutoDisconnection = (props) => {
  const { duration, handleClick, handleCancel, close } = props

  return (
    <Modal size='large' closeButton={false}>
      <ModalHeader icon='right-arrow' onClose={close}>
        <FormattedMessage id='modals.autodisconnection.title' defaultMessage='Are you still there?' />
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={300}>
          <FormattedMessage id='modals.autodisconnection.explain' defaultMessage="You've been inactive for {duration} minutes." values={{ duration: duration }} />
        </Text>
        <br />
        <Text size='14px' weight={300}>
          <FormattedMessage id='modals.autodisconnection.explain2' defaultMessage="Click 'Cancel' if you don't want to be logged out automatically." />
        </Text>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button onClick={handleCancel}>
            <FormattedMessage id='modals.autodisconnection.cancel' defaultMessage='Cancel' />
          </Button>
          <Button nature='logout' onClick={handleClick}>
            <FormattedMessage id='modals.autodisconnection.logout' defaultMessage='Log me out' />
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  )
}

AutoDisconnection.propTypes = {
  payload: PropTypes.shape({
    duration: PropTypes.number.isRequired,
    handleCancel: PropTypes.func,
    handleClick: PropTypes.func
  })
}

export default AutoDisconnection
