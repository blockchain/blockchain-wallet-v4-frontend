import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const Wrapper = styled.div`
  margin-bottom: 16px;
  cursor: initial;
`

const PendingSBTransactions: React.FC<Props> = ({ n }) => {
  return n > 0 ? (
    <Wrapper>
      <Text size='12px' weight={600} color='grey600'>
        {n}{' '}
        <FormattedMessage
          defaultMessage='Pending Transactions'
          id='copy.pending_txs'
        />
      </Text>
    </Wrapper>
  ) : null
}

const mapStateToProps = (state: RootState) => ({
  n: selectors.core.data.custodial.getTotalSBTransactionsPendingN(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(PendingSBTransactions)
