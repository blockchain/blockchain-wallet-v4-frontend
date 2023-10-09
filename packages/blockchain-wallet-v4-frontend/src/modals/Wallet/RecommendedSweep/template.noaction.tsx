import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { ImportedAddrType } from '@core/types'
import { Button, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { Analytics, ModalName } from 'data/types'

import { Props as OwnProps } from '.'

const NoActionRequired = (props: Props) => {
  const { position, total, walletGuid } = props

  useEffect(() => {
    props.analyticsActions.trackEvent({
      key: Analytics.NO_VULNERABLE_FUNDS_SHOWN,
      properties: {}
    })
  }, [])

  const thanksClicked = () => {
    props.modalActions.closeModal(ModalName.RECOMMENDED_IMPORTED_SWEEP)
    props.cacheActions.noActionRequiredSweep({ guid: walletGuid, seen: true })
  }

  const noImportedAddresses = props.bchAddresses?.length === 0 || props.btcAddresses?.length === 0

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.securitynotice.title' defaultMessage='Security Notice' />
      </ModalHeader>

      <ModalBody>
        <Text size='16px' weight={400} lineHeight='1.5' style={{ marginBottom: '16px' }}>
          {noImportedAddresses ? (
            <FormattedMessage
              id='modals.uptodate.body'
              defaultMessage='Your wallet does not contain any funds affected by the identified security issue. You can continue using your wallet normally.'
            />
          ) : (
            <FormattedMessage
              id='modals.uptodate.hasaddresses.body'
              defaultMessage='Your wallet does not currently contain any funds affected by the identified security issue. Please discontinue the use of the legacy addresses in your wallet for receiving funds. Should you receive funds into these addresses in the future, you will be prompted to transfer them to a new, secure address. You can now continue using your wallet normally.'
            />
          )}
        </Text>
        <Button data-e2e='upToDateThanks' nature='primary' fullwidth onClick={thanksClicked}>
          <FormattedMessage id='modals.securitynotice.uptodate.thanks' defaultMessage='Thanks!' />
        </Button>
      </ModalBody>
    </Modal>
  )
}

type Props = {
  bchAddresses?: ImportedAddrType[]
  btcAddresses?: ImportedAddrType[]
  position: number
  total: number
} & OwnProps

export default NoActionRequired
