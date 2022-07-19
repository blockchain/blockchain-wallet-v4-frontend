import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { isEmpty } from 'ramda'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'

import {
  CoinDataItem,
  useSelfCustodyCoinsBalances
} from '../../../hooks/useSelfCustodyCoinsBalances'
import FullScreenModal from '../common/FullScreenModal/FullScreenModal'
import CoinSelect from './CoinSelect'
import NoData from './NoData'
import SelectCoin from './SelectCoin'
import TransactionList from './TransactionList'

const FullHeightWrapper = styled(Flex)`
  height: calc(100% - 67px);
`

const TitleWrapper = styled(Flex)`
  padding-bottom: 12px;
`

const Activity: React.FC<Props> = ({ fetchErc20Transactions, fetchTransactions, transactions }) => {
  const coinBalances: CoinDataItem[] | null = useSelfCustodyCoinsBalances()
  const [selectedCoin, setSelectedCoin] = React.useState<string | null>(null)
  const [isSelectCoinOpen, setIsSelectCoinOpen] = React.useState<boolean>(false)

  const hasCoinBalances = coinBalances && !isEmpty(coinBalances)

  React.useEffect(() => {
    if (hasCoinBalances) {
      setSelectedCoin('ETH')
    }
  }, [hasCoinBalances])

  React.useEffect(() => {
    if (hasCoinBalances && selectedCoin) {
      if (selectedCoin === 'ETH') {
        fetchTransactions()
      } else {
        fetchErc20Transactions(selectedCoin)
      }
    }
  }, [fetchErc20Transactions, fetchTransactions, hasCoinBalances, coinBalances, selectedCoin])

  const handleSelectCoin = React.useCallback((coin: string) => {
    setSelectedCoin(coin)
    setIsSelectCoinOpen(false)
  }, [])

  const handleCloseModal = React.useCallback(() => {
    setIsSelectCoinOpen(false)
  }, [])

  const showEthTransactions = hasCoinBalances && selectedCoin && selectedCoin === 'ETH'
  const showErc20Transactions =
    hasCoinBalances && selectedCoin && selectedCoin !== 'ETH' && transactions[selectedCoin]

  return (
    <FullHeightWrapper flexDirection='column'>
      <>
        <TitleWrapper justifyContent='space-between' alignItems='center'>
          <Text size='20px' lineHeight='30px' color='white' weight={500}>
            <FormattedMessage id='plugin.activity.title' defaultMessage='Activity' />
          </Text>

          {hasCoinBalances && selectedCoin && (
            <CoinSelect selectedCoin={selectedCoin} onClick={() => setIsSelectCoinOpen(true)} />
          )}
        </TitleWrapper>

        {showEthTransactions &&
          transactions.eth[0].cata({
            Failure: (message) => <>{message}</>,
            Loading: () => (
              <FullHeightWrapper justifyContent='center' alignItems='center'>
                <SpinningLoader borderWidth='4px' width='36px' height='36px' />
              </FullHeightWrapper>
            ),
            NotAsked: () => null,
            Success: (value) =>
              isEmpty(value) ? (
                <NoData />
              ) : (
                <TransactionList transactions={value} coin={selectedCoin} />
              )
          })}

        {showErc20Transactions &&
          transactions[selectedCoin][0].cata({
            Failure: (message) => <>{message}</>,
            Loading: () => (
              <FullHeightWrapper justifyContent='center' alignItems='center'>
                <SpinningLoader borderWidth='4px' width='36px' height='36px' />
              </FullHeightWrapper>
            ),
            NotAsked: () => null,
            Success: (value) =>
              isEmpty(value) ? (
                <NoData />
              ) : (
                <TransactionList transactions={value} coin={selectedCoin} />
              )
          })}
      </>

      <FullScreenModal isOpen={isSelectCoinOpen}>
        <SelectCoin
          coins={coinBalances || []}
          onClose={handleCloseModal}
          onSelectCoin={handleSelectCoin}
        />
      </FullScreenModal>
    </FullHeightWrapper>
  )
}

const mapStateToProps = (state) => ({
  transactions: state.dataPath.eth.transactions
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchErc20Transactions: (token: string) =>
    dispatch(actions.core.data.eth.fetchErc20Transactions(token, true)),
  fetchTransactions: () => dispatch(actions.core.data.eth.fetchTransactions(null, true))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Activity)
