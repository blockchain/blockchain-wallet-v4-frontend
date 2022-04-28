import React from 'react'
import { FormattedMessage } from 'react-intl'

import { convertCoinToCoin } from '@core/exchange'
import FiatDisplay from 'components/Display/FiatDisplay'
import { CellHeaderText, CellText } from 'components/Table'

export const getVolumeColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellText>
        <FiatDisplay weight={600} color='black' size='14px' coin='ETH' currency='USD'>
          {convertCoinToCoin({ baseToStandard: false, coin: 'ETH', value: values.one_day_volume })}
        </FiatDisplay>
      </CellText>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.24h_volume' defaultMessage='24 Hour Volume' />
    </CellHeaderText>
  ),
  accessor: 'one_day_volume',
  disableGlobalFilter: true
})
