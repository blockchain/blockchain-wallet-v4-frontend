import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getTotalBSTransactionsPendingN } from '@core/redux/data/custodial/selectors'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  margin-bottom: 16px;
  cursor: initial;
`

const PendingBSTransactions = () => {
  const pendingTransactions = useSelector(getTotalBSTransactionsPendingN)

  if (pendingTransactions <= 0) return null
  return (
    <Wrapper>
      <Text size='12px' weight={600} color='grey600'>
        {pendingTransactions}{' '}
        <FormattedMessage defaultMessage='Pending Transactions' id='copy.pending_txs' />
      </Text>
    </Wrapper>
  )
}

export default PendingBSTransactions
