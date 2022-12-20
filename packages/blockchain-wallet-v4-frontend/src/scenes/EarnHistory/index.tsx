import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Flex, IconChevronLeft, Padding, SemanticColors, Text } from '@blockchain-com/constellation'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { EarnTabsType } from 'data/types'
import { useRemote } from 'hooks'

import { getData } from './EarnHistory.selectors'
import Filter from './Filter'
import Loading from './template.loading'
import TransactionList from './template.success'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
`
const Container = styled.div`
  width: fit-content;
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
      <Container>
        <LinkContainer to='/earn'>
          <Link>
            <Flex alignItems='center'>
              <IconChevronLeft color={SemanticColors.primary} size='medium' />
              <Text color={SemanticColors.primary} variant='caption1'>
                <FormattedMessage id='copy.earn' defaultMessage='Earn' />
              </Text>
            </Flex>
          </Link>
        </LinkContainer>
      </Container>
      <Padding vertical={1}>
        <Text variant='title1'>
          <FormattedMessage id='copy.activity' defaultMessage='Activity' />
        </Text>
      </Padding>
      <Filter
        earnTab={earnTab}
        handleTabClick={handleTabClick}
        rates={rates}
        txPages={txPages}
        walletCurrency={walletCurrency}
      />

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
