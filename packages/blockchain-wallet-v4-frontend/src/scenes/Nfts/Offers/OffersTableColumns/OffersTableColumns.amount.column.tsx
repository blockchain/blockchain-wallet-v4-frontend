import React from 'react'
import { FormattedMessage } from 'react-intl'

import FiatDisplay from 'components/Display/FiatDisplay'
import { CellHeaderText, CellText } from 'components/Table'

export const getAmountColumn = () => ({
  Cell: ({ row: { original: offer } }) => {
    return (
      <CellText>
        <FiatDisplay
          weight={600}
          size='14px'
          color='grey900'
          currency='USD'
          coin={offer.payment_token_contract.symbol}
        >
          {offer.current_price}
        </FiatDisplay>
      </CellText>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.amount' defaultMessage='Amount' />
    </CellHeaderText>
  ),
  accessor: 'amount',
  disableGlobalFilter: true
})
