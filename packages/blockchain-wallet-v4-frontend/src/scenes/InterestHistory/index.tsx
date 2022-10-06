import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { SceneWrapper } from 'components/Layout'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions } from 'data'

import EarnHeader from '../Earn/Earn.template.header'
import EarnMenu from '../Earn/Earn.template.menu'
import CoinFilter from './CoinFilter'
import DownloadTransactions from './DownloadTransactions'
import { getData } from './selectors'
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

class InterestHistoryContainer extends Component<Props> {
  componentDidMount() {
    this.props.interestActions.fetchEarnTransactions({ reset: true })
  }

  componentWillUnmount() {
    // clear transactions related data on exit
    this.props.interestActions.fetchEarnTransactionsSuccess({ reset: true, transactions: [] })
    this.props.interestActions.setRewardsTransactionsNextPage({ nextPage: null })
  }

  onFetchMoreTransactions = () => {
    this.props.interestActions.fetchEarnTransactions({ reset: false })
  }

  render() {
    const { data } = this.props
    return (
      <SceneWrapper>
        <EarnHeader />
        {data.cata({
          Failure: () => null,
          Loading: () => <Loading />,
          NotAsked: () => <Loading />,
          Success: (val) => {
            return (
              <>
                <MenuRow>
                  <EarnMenu />
                  <DownloadTransactions />
                  <CoinFilter {...val} />
                </MenuRow>
                <LazyLoadWrapper triggerDistance={200} onLazyLoad={this.onFetchMoreTransactions}>
                  <TransactionList {...val} {...this.props} />
                </LazyLoadWrapper>
              </>
            )
          }
        })}
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = ConnectedProps<typeof connector>

export default connector(InterestHistoryContainer)
