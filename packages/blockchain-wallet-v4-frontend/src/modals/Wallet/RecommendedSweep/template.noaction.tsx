import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { ModalName } from 'data/types'

import { Props as OwnProps } from '.'

const NoActionRequired = (props: Props) => {
  const { position, total } = props

  useEffect(() => {
    props.cacheActions.noActionRequiredSweep(true)
  }, [])

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.securitynotice.title' defaultMessage='Security Notice' />
      </ModalHeader>

      <ModalBody>
        <Text size='16px' weight={400} lineHeight='1.5' style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='modals.uptodate.body'
            defaultMessage='Good news: Your wallet does not contain any funds in potentially at-risk legacy addresses. No further action is needed.'
          />
        </Text>
        <Button
          data-e2e='upToDateThanks'
          nature='primary'
          fullwidth
          onClick={() => props.modalActions.closeModal(ModalName.RECOMMENDED_IMPORTED_SWEEP)}
        >
          <FormattedMessage id='modals.uptodate.thanks' defaultMessage='Thanks!' />
        </Button>
      </ModalBody>
    </Modal>
  )
}

type Props = {
  position: number
  total: number
} & OwnProps

export default NoActionRequired
