import React from 'react'

import { RawOrder } from '@core/network/api/nfts/types'
import { TableWrapper } from 'components/Table'

import OffersTable from './Offers.table'

const Offers: React.FC<Props> = ({ bidsAndOffers, columns, defaultEthAddr }) => {
  return (
    <TableWrapper height='auto'>
      <OffersTable
        columns={columns || ['price', 'amount', 'from', 'expiration']}
        bidsAndOffers={bidsAndOffers}
        defaultEthAddr={defaultEthAddr}
      />
    </TableWrapper>
  )
}

type Props = {
  address?: never
  bidsAndOffers: RawOrder[]
  columns?: ('price' | 'amount' | 'from' | 'expiration' | 'cancel_offer')[]
  defaultEthAddr: string
}

export default Offers
