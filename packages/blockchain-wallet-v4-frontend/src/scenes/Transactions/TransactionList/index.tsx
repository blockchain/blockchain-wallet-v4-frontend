import { CoinType, FiatType, RemoteDataType } from 'core/types'
import { SkeletonRectangle } from 'blockchain-info-components'
import DataError from 'components/DataError'
import React from 'react'
import styled from 'styled-components'
import TransactionListItem from 'components/TransactionListItem'

const LoadingSkeleton = styled(SkeletonRectangle)`
  display: flex;
  flex-direction: column;
  align-items: start;
  box-sizing: border-box;
  padding-top: 25px;
`
const LoadingTxSkeleton = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 15px;
  & > :first-child {
    margin-bottom: 5px;
  }
`
const TransactionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  &:last-child {
    > div {
      border: none;
    }
  }
`

const Loading = () => (
  <LoadingSkeleton height='450px' width='100%' bgColor='white'>
    <LoadingTxSkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='gray-1' />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColor='grey100'
      />
    </LoadingTxSkeleton>
    <LoadingTxSkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='gray-1' />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColor='grey100'
      />
    </LoadingTxSkeleton>
    <LoadingTxSkeleton>
      <SkeletonRectangle width='50%' height='30px' bgColor='gray-1' />
      <SkeletonRectangle
        width='calc(100% - 30px)'
        height='80px'
        bgColor='grey100'
      />
    </LoadingTxSkeleton>
  </LoadingSkeleton>
)

export type Props = {
  buySellPartner: 'coinify' | 'sfox'
  coin: CoinType
  coinTicker: string
  currency: FiatType
  data: RemoteDataType<{ message: string }, Array<{ hash: string }>>
  onArchive: (address: string) => void
  onLoadMore: () => void
  onRefresh: () => void
}

class TransactionList extends React.PureComponent<Props> {
  render () {
    const { buySellPartner, coin, coinTicker, currency, data } = this.props

    return data.cata({
      Success: transactions => (
        <TransactionsWrapper>
          {transactions.map(tx => {
            return (
              <TransactionListItem
                key={tx.hash}
                transaction={tx}
                coin={coin}
                coinTicker={coinTicker}
                currency={currency}
                buySellPartner={buySellPartner}
              />
            )
          })}
        </TransactionsWrapper>
      ),
      Failure: message => (
        <DataError onClick={this.props.onArchive} message={message} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default TransactionList
