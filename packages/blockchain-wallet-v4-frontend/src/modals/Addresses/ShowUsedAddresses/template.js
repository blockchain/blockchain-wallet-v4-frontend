import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { spacing } from 'services/styles'

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

const ShowUsedAddresses = props => {
  const { busy, closeAll, position, total, ...rest } = props
  const { handleContinue } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <HeaderWrapper>
          <Icon
            name='alert-filled'
            size='26px'
            className={'warning-icon'}
            color='brand-yellow'
          />
          <FormattedMessage
            id='modals.showusedaddresses.title'
            defaultMessage='Are you sure?'
          />
        </HeaderWrapper>
      </ModalHeader>
      <ModalBody>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='modals.showusedaddresses.message'
            defaultMessage='Viewing used addresses can be helpful for debugging purposes, and is recommended for advanced users only. For privacy reasons, we strongly discourage using each address more than once.'
          />
        </Text>
      </ModalBody>
      <ModalFooter align='right'>
        <CancelBtn
          size='small'
          weight={400}
          style={spacing('mr-15')}
          onClick={closeAll}
          data-e2e='cancelShowUsedAddressesButton'
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </CancelBtn>
        <Button
          nature='primary'
          type='submit'
          onClick={handleContinue}
          disabled={busy}
          data-e2e='showUsedAddressesConfirmButton'
        >
          {!busy ? (
            <FormattedMessage
              id='modals.showusedaddresses.ok'
              defaultMessage='Ok'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ShowUsedAddresses
