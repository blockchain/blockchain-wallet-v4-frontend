import React from 'react'

import { OpenSeaOrder } from '@core/network/api/nfts/types'
import { TableWrapper } from 'components/Table'

import OffersTable from './Offers.table'

const Offers: React.FC<Props> = ({ bidsAndOffers, columns }) => {
  return (
    <TableWrapper height='auto'>
      <OffersTable
        columns={columns || ['price', 'amount', 'from', 'expiration']}
        bidsAndOffers={bidsAndOffers}
      />
    </TableWrapper>
  )
}

type Props = {
  address?: never
  bidsAndOffers: OpenSeaOrder[]
  columns?: ('price' | 'amount' | 'from' | 'expiration')[]
}

export default Offers
