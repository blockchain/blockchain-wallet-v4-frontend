import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { Component } from 'react'

import {
  FiatType,
  InterestTransactionType,
  NabuApiErrorType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'

import { getData } from './selectors'
import { RatesType } from 'data/components/borrow/types'
import TransactionList from './template.success'

class TransactionListContainer extends Component<Props> {
  componentDidMount () {
    this.props.interestActions.fetchInterestTransactions(true)
  }

  render () {
    return this.props.data.cata({
      Success: val => <TransactionList {...val} {...this.props} />,
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
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
  rates: RatesType
  supportedCoins: SupportedCoinsType
  txPages: Array<Array<InterestTransactionType>>
  walletCurrency: FiatType
}

type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
}

export type Props = ConnectedProps<typeof connector>

export default connector(TransactionListContainer)
