import React from 'react'

import { CustodialTransactionRow } from '../components'
import { SBTransactionType } from 'core/types'

const FiatTxListItem: React.FC<Props> = props => {
  return (
    <CustodialTransactionRow>
      {JSON.stringify(props.tx)}
    </CustodialTransactionRow>
  )
}

type Props = {
  tx: SBTransactionType
}

export default FiatTxListItem
