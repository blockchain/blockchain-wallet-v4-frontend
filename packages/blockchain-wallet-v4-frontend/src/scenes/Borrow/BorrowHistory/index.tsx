import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { LoanType, OfferType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'

import { getData } from './selectors'
import Success from './template.success'

const History = styled.div`
  margin-top: 72px;
  max-width: 1200px;
`

class BorrowHistory extends Component<Props> {
  state = {}

  showLoanDetails = (loan: LoanType, offer: OfferType) => {
    this.props.borrowActions.setStep({ step: 'DETAILS', loan, offer })
    this.props.modalActions.showModal('BORROW_MODAL', {
      origin: 'BorrowHistorySection'
    })
  }

  render() {
    return (
      <History>
        {this.props.data.cata({
          Success: val => (
            <Success {...val} showLoanDetails={this.showLoanDetails} />
          ),
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
  borrowActions: bindActionCreators(actions.components.borrow, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']
type Props = ConnectedProps<typeof connector>

export default connector(BorrowHistory)
