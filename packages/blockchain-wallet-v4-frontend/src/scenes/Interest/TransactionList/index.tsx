import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { Component } from 'react'
import styled from 'styled-components'

import { getData } from './selectors'
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

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = ConnectedProps<typeof connector>

export default connector(TransactionListContainer)
