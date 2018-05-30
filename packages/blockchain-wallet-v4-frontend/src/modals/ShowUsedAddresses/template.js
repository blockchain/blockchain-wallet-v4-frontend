import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { spacing } from 'services/StyleService'
import { Button, HeartbeatLoader, Icon, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  .warning-icon {
    margin-right: 6px;
  }
`
const CancelBtn = styled(Text)`
  &:hover {
    cursor: pointer;
  }
`

const ShowUsedAddresses = (props) => {
  const { busy, position, total, close, ...rest } = props
  const { handleContinue } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={close}>
        <HeaderWrapper>
          <Icon name='alert-filled' size='26px' className={'warning-icon'} color='brand-yellow' />
          <FormattedMessage id='modals.show_used_addresses.title' defaultMessage='Are you sure?' />
        </HeaderWrapper>
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={300}>
          <FormattedMessage id='modals.show_used_addresses.message' defaultMessage='Viewing used addresses can be helpful for debugging purposes, and is recommended for advanced users only. For privacy reasons, we strongly discourage using each address more than once.'/>
        </Text>
      </ModalBody>
      <ModalFooter align='right'>
        <CancelBtn size='small' weight={300} style={spacing('mr-15')} onClick={close}>
          <FormattedMessage id='modals.show_used_addresses.cancel' defaultMessage='Cancel' />
        </CancelBtn>
        <Button uppercase nature='primary' type='submit' onClick={handleContinue} disabled={busy}>
          {
            !busy
              ? <FormattedMessage id='modals.show_used_addresses.ok' defaultMessage='OK' />
              : <HeartbeatLoader height='20px' width='20px' color='white' />
          }
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ShowUsedAddresses
