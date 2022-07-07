import React from 'react'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { CellHeaderText, CellText } from 'components/Table'
import { CoinIcon } from 'layouts/Wallet/components'

export const getPriceColumn = () => ({
  Cell: ({ row: { original: offer } }) => {
    return (
      <CellText>
        <Flex gap={6} alignItems='center'>
          {/* TODO: SEAPORT */}
          <CoinIcon name='WETH' />
          {/* TODO: SEAPORT */}
          <CoinDisplay coin='WETH' weight={600} size='14px' color='grey900'>
            {offer.current_price}
          </CoinDisplay>
        </Flex>
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
