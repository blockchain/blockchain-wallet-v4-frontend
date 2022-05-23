import React from 'react'

import { NftAsset, RawOrder } from '@core/network/api/nfts/types'

import { NftTableWrapper } from '../Asset/components'
import OffersTable from './Offers.table'

const Offers: React.FC<Props> = ({ asset, bidsAndOffers, columns, defaultEthAddr }) => {
  return (
    <NftTableWrapper height='auto'>
      <OffersTable
        asset={asset}
        columns={columns || ['price', 'from', 'expiration', 'action']}
        bidsAndOffers={bidsAndOffers}
        defaultEthAddr={defaultEthAddr}
      />
    </NftTableWrapper>
  )
}

type Props = {
  address?: never
  asset?: NftAsset
  bidsAndOffers: RawOrder[]
  columns?: ('price' | 'amount' | 'from' | 'expiration' | 'action')[]
  defaultEthAddr: string
}

export default Offers
