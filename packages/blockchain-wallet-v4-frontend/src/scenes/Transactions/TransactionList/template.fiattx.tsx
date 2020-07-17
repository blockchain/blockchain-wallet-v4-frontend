import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

import { SBTransactionType } from 'core/types'
import { TransactionRow } from '../components'

const FiatTxListItem: React.FC<Props> = props => {
  return <TransactionRow>{JSON.stringify(props.tx)}</TransactionRow>
}

type Props = {
  tx: SBTransactionType
}

export default FiatTxListItem
