import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { Component } from 'react'
import styled from 'styled-components'

import {
  CoinType,
  FiatType,
  InterestTransactionType,
  NabuApiErrorType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'

import { getData } from './selectors'
import { RatesType } from 'data/components/borrow/types'
import TransactionList from './template.success'

const History = styled.div`
  max-width: 1200px;
`

class TransactionListContainer extends Component<Props> {
  componentDidMount () {
    this.props.interestActions.fetchInterestTransactions(true)
  }

  render () {
    return (
      <History>
        {this.props.data.cata({
          Success: val => <TransactionList {...val} {...this.props} />,
          Failure: () => null,
          Loading: () => null,
          NotAsked: () => null
        })}
      </History>
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = {
  btcRates: RatesType
  coin: CoinType
  supportedCoins: SupportedCoinsType
  txPages: Array<Array<InterestTransactionType>>
  walletCurrency: FiatType
}

type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
}

export type Props = ConnectedProps<typeof connector>

export default connector(TransactionListContainer)
