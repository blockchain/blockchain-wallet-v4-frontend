import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Props as OwnProps } from 'layouts/Nfts/Nfts'

import NftSettingsMenu from './NftSettingsMenu'

const NftSettings: React.FC<Props> = ({ ethAddress, isAuthenticated, routerActions }) => {
  const currentAddress = window.location.href.split('/nfts/address/settings/')[1]

  if (!isAuthenticated) {
    routerActions.push('/login')
  }

  if (ethAddress.toLowerCase() !== currentAddress?.toLowerCase()) {
    routerActions.push('/login')
  }

  return (
    <div style={{ paddingTop: '0px' }}>
      <NftSettingsMenu />
      <div>
        <Text size='24px' color='black' weight={600}>
          <FormattedMessage id='copy.notifications' defaultMessage='Notifications' />
        </Text>
      </div>
    </div>
  )
}

type Props = OwnProps

export default NftSettings
