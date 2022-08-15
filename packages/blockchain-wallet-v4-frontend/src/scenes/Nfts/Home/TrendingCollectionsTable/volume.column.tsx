import React from 'react'
import { FormattedMessage } from 'react-intl'

import { convertCoinToCoin } from '@core/exchange'
import FiatDisplay from 'components/Display/FiatDisplay'
import { CellHeaderText, CellText } from 'components/Table'
import { useMedia } from 'services/styles'

export const getVolumeColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    return (
      <CellText>
        <FiatDisplay weight={600} color='black' size='14px' coin='ETH' currency='USD'>
          {convertCoinToCoin({
            baseToStandard: false,
            coin: 'ETH',
            value: values.stats.one_day_volume
          })}
        </FiatDisplay>
      </CellText>
    )
  },
  Header: () => {
    const isMobile = useMedia('mobile')
    const isTablet = useMedia('tablet')

    return (
      <CellHeaderText>
        {isMobile || isTablet ? (
          <FormattedMessage id='buttons.volume' defaultMessage='Volume' />
        ) : (
          <FormattedMessage id='copy.24h_volume' defaultMessage='24 Hour Volume' />
        )}
      </CellHeaderText>
    )
  },
  accessor: 'stats.one_day_volume',
  disableGlobalFilter: true
})
