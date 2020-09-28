import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { Wrapper } from 'components/Balances'
import React from 'react'

const PendingSBTransactions: React.FC<Props> = ({ n }) => {
  return <Wrapper>{n}</Wrapper>
}

const mapStateToProps = (state: RootState) => ({
  n: selectors.core.data.sbCore.getTotalSBTransactionsPendingN(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(PendingSBTransactions)
