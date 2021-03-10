import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'

const TitleGroup = styled(TextGroup)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const DeleteAdresssLabel = props => {
  const { close, onDeleteConfirm } = props

  return (
    <Modal size='large'>
      <ModalHeader onClose={close}>
        <TitleGroup inline>
          <Icon name='alert-filled' size='32px' color='brand-yellow' />
          <Text weight={400} size={'22px'} style={{ paddingLeft: '8px' }}>
            <FormattedMessage
              id='modal.deleteaddresslabel.title'
              defaultMessage='Remove Label?'
            />
          </Text>
        </TitleGroup>
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text weight={400} size={'14px'} color='grey700'>
            <FormattedMessage
              id='modal.deleteaddresslabel.message'
              defaultMessage='Removing a label does not delete this address, you can still safely receive funds to it. This action cannot be undone.'
            />
          </Text>
        </TextGroup>
      </ModalBody>
      <ModalFooter align='right'>
        <Link
          size='13px'
          weight={400}
          onClick={close}
          data-e2e='cancelAddressDeleteLink'
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Link>
        <Button
          type='submit'
          nature='primary'
          onClick={() => {
            onDeleteConfirm()
          }}
          style={{ marginLeft: '20px' }}
          data-e2e='deleteAddressConfirmButton'
        >
          <FormattedMessage
            id='modal.deleteaddresslabel.delete'
            defaultMessage='Delete Label'
          />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteAdresssLabel
