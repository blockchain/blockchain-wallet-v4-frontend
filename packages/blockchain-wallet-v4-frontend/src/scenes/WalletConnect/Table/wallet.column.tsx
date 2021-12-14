import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CellHeaderText, CellText } from '.'

export const getWalletColumn = () => ({
  Cell: () => {
    return <CellText>ETH Private Key Wallet</CellText>
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
    </CellHeaderText>
  ),
  accessor: 'wallet'
})
