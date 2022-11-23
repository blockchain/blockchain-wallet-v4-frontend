import React, { useEffect } from 'react'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { SceneWrapper } from 'components/Layout'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { EarnTabsType } from 'data/types'
import { useRemote } from 'hooks'

import EarnHeader from '../Earn/Earn.template.header'
import CoinFilter from './CoinFilter'
import DownloadTransactions from './DownloadTransactions'
import { getData } from './EarnHistory.selectors'
import Tabs from './Tabs'
import Loading from './template.loading'
import TransactionList from './template.success'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
`

const MenuRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
`

const EarnHistoryContainer = ({ earnActions }: Props) => {
  const earnTab: EarnTabsType = useSelector((state: RootState) => state.components.interest.earnTab)
  const { data, error, isLoading, isNotAsked } = useRemote(getData)

  useEffect(() => {
    earnActions.fetchEarnTransactions({ reset: true })

    return () => {
      earnActions.fetchEarnTransactionsSuccess({ reset: true, transactions: [] })
      earnActions.setRewardsTransactionsNextPage({ nextPage: null })
      earnActions.setEarnTab({ tab: 'All' })
    }
  }, [])

  useEffect(() => {
    earnActions.fetchEarnTransactions({ reset: true })
  }, [earnTab])

  const onFetchMoreTransactions = () => {
    earnActions.fetchEarnTransactions({ reset: false })
  }

  const handleTabClick = (tab: EarnTabsType) => {
    earnActions.setEarnTab({ tab })
  }

  if (error) return null

  if (!data || isLoading || isNotAsked) return <Loading />

  const { rates, txPages, walletCurrency } = data

  return (
    <SceneWrapper>
      <EarnHeader />
      <MenuRow>
        <Tabs earnTab={earnTab} handleTabClick={handleTabClick} />
        <DownloadTransactions />
        <CoinFilter rates={rates} txPages={txPages} walletCurrency={walletCurrency} />
      </MenuRow>
      <LazyLoadWrapper triggerDistance={200} onLazyLoad={onFetchMoreTransactions}>
        <TransactionList
          earnActions={earnActions}
          rates={rates}
          txPages={txPages}
          walletCurrency={walletCurrency}
        />
      </LazyLoadWrapper>
    </SceneWrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  earnActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = ConnectedProps<typeof connector>

export default connector(EarnHistoryContainer)
