import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'

import {
  CoinType,
  InterestTransactionResponseType,
  NabuApiErrorType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { getData } from './selectors'

import { UserDataType } from 'data/types'
import React, { Component } from 'react'
import styled from 'styled-components'
import TransactionList from './template.success'

const History = styled.div`
  margin-top: 48px;
  max-width: 1200px;
`

class TransactionListContainer extends Component<Props> {
  componentDidMount () {
    this.props.interestActions.fetchInterestTransactions()
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
const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type SuccessStateType = {
  coin: CoinType
  interestHistory: InterestTransactionResponseType
  supportedCoins: SupportedCoinsType
  userData: UserDataType
}

type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
}

type Props = ConnectedProps<typeof connector>

export default connector(TransactionListContainer)
