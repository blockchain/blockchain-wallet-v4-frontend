import React from 'react'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import { CellHeaderText, CellText } from 'components/Table'

export const getPriceColumn = () => ({
  Cell: ({ row: { original: offer } }) => {
    return (
      <CellText>
        <CoinDisplay
          coin={offer.payment_token_contract.symbol}
          weight={600}
          size='14px'
          color='grey900'
        >
          {offer.base_price}
        </CoinDisplay>
      </CellText>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.price' defaultMessage='Price' />
    </CellHeaderText>
  ),
  accessor: 'price',
  disableGlobalFilter: true
})
