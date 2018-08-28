import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  FlatLoader,
  Modal,
  ModalHeader,
  ModalBody,
  TextGroup,
  Text
} from 'blockchain-info-components'

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
`

const LockboxFirmware = props => {
  return (
    <Modal size='large' position={props.position} total={props.total}>
      <ModalHeader icon='lock' onClose={props.closeAll}>
        <FormattedMessage
          id='modals.lockboxfirmware.title'
          defaultMessage='Update Lockbox Firmware'
        />
      </ModalHeader>
      <ModalBody>
        <TextGroup>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='modals.lockboxfirmware.step1'
              defaultMessage='1. Connect your Lockbox and open the Dashboard.'
            />
          </Text>
        </TextGroup>
        <LoaderContainer>
          <FlatLoader width='150px' height='25px' />
        </LoaderContainer>
      </ModalBody>
    </Modal>
  )
}

export default LockboxFirmware
