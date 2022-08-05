import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { isEmpty } from 'ramda'
import styled from 'styled-components'

import { EthProcessedTxType } from '@core/transactions/types'
import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { getBlockHeight } from '../../../Transactions/NonCustodialTx/Confirmations/selectors'
import FullScreenModal from '../../common/FullScreenModal'
import { getIsConfirmed } from '../statusUtils'
import TransactionDetails from '../TransactionDetails'
import TransactionListItem from './TransactionListItem'

interface ITransactionListProps {
  blockHeight: any
  coin: string
  transactions: EthProcessedTxType[]
}

const Wrapper = styled.div`
  overflow: auto;
  padding-top: 24px;
`

const TransactionList: React.FC<ITransactionListProps> = ({ blockHeight, coin, transactions }) => {
  const [selectedTx, setSelectedTx] = React.useState<EthProcessedTxType | null>(null)

  const confirmedTransactions = React.useMemo(
    () =>
      transactions.filter((tx) => getIsConfirmed(blockHeight.number, Number(tx.blockHeight), coin)),
    [blockHeight.number, coin, transactions]
  )

  const pendingTransactions = React.useMemo(
    () =>
      transactions.filter(
        (tx) => !getIsConfirmed(blockHeight.number, Number(tx.blockHeight), coin)
      ),
    [blockHeight.number, coin, transactions]
  )

  const handleTransactionClick = React.useCallback(
    (tx: EthProcessedTxType) => setSelectedTx(tx),
    []
  )

  const handleCloseModal = React.useCallback(() => setSelectedTx(null), [])

  return (
    <Wrapper>
      {!isEmpty(pendingTransactions) && (
        <>
          <Text size='14px' lineHeight='150%' color='grey400' weight={500}>
            <FormattedMessage id='plugin.activity.transactionList.queue' defaultMessage='Queue' /> (
            {pendingTransactions.length}
          </Text>
          <Padding top={16} bottom={45}>
            <Flex flexDirection='column'>
              {pendingTransactions.map((item) => (
                <TransactionListItem
                  coin={coin}
                  item={item}
                  key={item.hash}
                  status='PENDING'
                  onClick={handleTransactionClick}
                />
              ))}
            </Flex>
          </Padding>
        </>
      )}

      {!isEmpty(confirmedTransactions) && (
        <>
          <Text size='14px' lineHeight='150%' color='grey400' weight={500}>
            <FormattedMessage
              id='plugin.activity.transactionList.history'
              defaultMessage='History'
            />
          </Text>

          <Padding top={16} bottom={45}>
            <Flex gap={20} flexDirection='column'>
              {confirmedTransactions.map((item) => (
                <TransactionListItem
                  coin={coin}
                  item={item}
                  key={item.hash}
                  status='CONFIRMED'
                  onClick={handleTransactionClick}
                />
              ))}
            </Flex>
          </Padding>
        </>
      )}

      <FullScreenModal isOpen={!!selectedTx}>
        {selectedTx && (
          <TransactionDetails
            coin={coin}
            status={
              getIsConfirmed(blockHeight, selectedTx.blockHeight, coin) ? 'CONFIRMED' : 'PENDING'
            }
            transaction={selectedTx}
            onClose={handleCloseModal}
          />
        )}
      </FullScreenModal>
    </Wrapper>
  )
}

const mapStateToProps = (state, ownProps) => ({
  blockHeight: getBlockHeight(state, ownProps.coin)
})

export default connect(mapStateToProps)(TransactionList)
