import React from 'react'

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
    </div>
  )
}

type Props = OwnProps

export default NftSettings
