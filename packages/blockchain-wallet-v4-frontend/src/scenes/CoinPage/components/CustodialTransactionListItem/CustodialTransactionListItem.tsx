import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconPlus } from '@blockchain-com/icons'

import { StandardRow } from 'components/Rows'

import { CustodialTransactionListItemComponent } from './CustodialTransactionListItem.types'

const CustodialTransactionListItem: CustodialTransactionListItemComponent = ({
  onClick,
  transaction
}) => {
  return (
    <StandardRow
      topLeftText='text'
      bottomLeftText=''
      bottomRightText=''
      topRightText=''
      onClick={onClick}
      icon={
        <Icon label=''>
          <IconPlus />
        </Icon>
      }
    />
  )
}

export default CustodialTransactionListItem
