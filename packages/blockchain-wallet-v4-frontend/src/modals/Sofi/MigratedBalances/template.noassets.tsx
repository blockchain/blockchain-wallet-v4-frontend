import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/types'

const NoAssetsMigrated = () => {
  const dispatch = useDispatch()

  const viewAccountClick = () => {
    dispatch(actions.modals.closeModal(ModalName.SOFI_MIGRATED_BALANCES))
  }
  return (
    <>
      <Image name='no-balance' width='88px' />
      <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='scenes.sofi.modal.migratedbalances.header.noassets'
          defaultMessage='No assets were migrated'
        />
      </Text>
      <Text
        size='16px'
        weight={500}
        color='grey600'
        lineHeight='1.5'
        style={{ marginBottom: '32px', marginTop: '16px', textAlign: 'center' }}
      >
        <FormattedMessage
          id='scenes.sofi.welcome.modal.body.noassets'
          defaultMessage='Your SoFi account had no assets to migrate.'
        />
      </Text>
      <Link
        href='https://support.blockchain.com/hc/en-us/requests/new'
        target='_blank'
        style={{ marginBottom: '8px', width: '100%' }}
      >
        <Button nature='light' fullwidth data-e2e='sofiContactSupport'>
          <FormattedMessage id='buttons.sofi_support' defaultMessage='Does something look wrong?' />
        </Button>
      </Link>
      <Button nature='primary' fullwidth data-e2e='sofiContinue' onClick={viewAccountClick}>
        <FormattedMessage id='buttons.view_my_account' defaultMessage='View my account' />
      </Button>
    </>
  )
}

export default NoAssetsMigrated
