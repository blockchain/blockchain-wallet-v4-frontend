import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Link, Modal, ModalHeader, ModalBody, ModalFooter, TextGroup, Text } from 'blockchain-info-components'

const TitleGroup = styled(TextGroup)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const DeleteAdressLabel = (props) => {
  const { onDeleteConfirm, close } = props

  return (
    <Modal size='large'>
      <ModalHeader onClose={close}>
        <TitleGroup inline>
          <Icon name='alert-filled' size='32px' color='brand-yellow' />
          <Text weight={300} size={'22px'} style={{ paddingLeft: '8px' }}>
            <FormattedMessage id='modal.deleteaddresslabel.title' defaultMessage="Remove Label?" />
          </Text>
        </TitleGroup>
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text weight={300} size={'14px'} color='gray-5'>
            <FormattedMessage id='modal.deleteaddresslabel.message' defaultMessage="Removing a label does not delete this address, you can still safely receive funds to it. This action cannot be undone." />
          </Text>
        </TextGroup>
      </ModalBody>
      <ModalFooter align='right'>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.deleteaddresslabel.cancel' defaultMessage='Cancel' />
        </Link>
        <Button type='submit' nature='primary' onClick={() => { onDeleteConfirm() }} style={{ marginLeft: '20px' }}>
          <FormattedMessage id='modal.deleteaddresslabel.delete' defaultMessage='Delete Label' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteAdressLabel
