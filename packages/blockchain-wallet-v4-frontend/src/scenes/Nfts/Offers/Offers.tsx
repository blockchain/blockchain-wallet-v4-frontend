import React from 'react'

import { NftAsset, SeaportRawOrder } from '@core/network/api/nfts/types'

import { NftTableWrapper } from '../Asset/components'
import OffersTable from './Offers.table'

const Offers: React.FC<Props> = ({ asset, columns, defaultEthAddr, isOwner, offers }) => {
  return (
    <NftTableWrapper height='auto'>
      <OffersTable
        asset={asset}
        isOwner={isOwner}
        columns={columns || ['price', 'from', 'expiration', 'action']}
        offers={offers}
        defaultEthAddr={defaultEthAddr}
      />
    </NftTableWrapper>
  )
}

type Props = {
  address?: never
  asset?: NftAsset
  columns?: ('price' | 'amount' | 'from' | 'expiration' | 'action')[]
  defaultEthAddr: string
  isOwner: boolean
  offers: SeaportRawOrder[]
}

export default Offers
