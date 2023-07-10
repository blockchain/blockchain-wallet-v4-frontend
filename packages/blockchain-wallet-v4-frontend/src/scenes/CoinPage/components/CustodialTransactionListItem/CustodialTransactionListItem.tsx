import React from 'react'
import { IconPlus } from '@blockchain-com/constellation'

import { StandardRow } from 'components/Rows'

import { CustodialTransactionListItemComponent } from './CustodialTransactionListItem.types'

const CustodialTransactionListItem: CustodialTransactionListItemComponent = ({ onClick }) => {
  return (
    <StandardRow
      topLeftText='text'
      bottomLeftText=''
      bottomRightText=''
      topRightText=''
      onClick={onClick}
      icon={<IconPlus />}
    />
  )
}

export default CustodialTransactionListItem
