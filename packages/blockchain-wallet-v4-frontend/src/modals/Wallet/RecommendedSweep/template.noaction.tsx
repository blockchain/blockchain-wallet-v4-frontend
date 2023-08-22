import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  HeartbeatLoader,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'

import { Props as OwnProps } from '.'

const NoActionRequired = (props: Props) => {
  const { position, total } = props

  useEffect(() => {
    props.cacheActions.noActionRequiredSweep(true)
  }, [])

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.uptodata.title' defaultMessage='Up to date' />
      </ModalHeader>

      <ModalBody>
        <Text>HI!</Text>
      </ModalBody>
    </Modal>
  )
}

type Props = {
  position: number
  total: number
} & OwnProps

export default NoActionRequired
