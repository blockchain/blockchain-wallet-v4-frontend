import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { LoanType, NabuApiErrorType, RemoteDataType } from 'core/types'
import { Text } from 'blockchain-info-components'
import { UserDataType } from 'data/types'
import Loading from './template.loading'
import React, { Component } from 'react'
import Success from './template.success'

export type SuccessStateType = {
  borrowHistory: Array<LoanType>
  showLoanDetails: (loan: LoanType) => void
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
}
export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
  modalActions: typeof actions.modals
}
type Props = LinkStatePropsType & LinkDispatchPropsType

class BorrowHistory extends Component<Props> {
  state = {}

  showLoanDetails = (loan: LoanType) => {
    this.props.borrowActions.setStep('DETAILS')
    this.props.modalActions.showModal('BORROW_MODAL', { loan })
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...val} showLoanDetails={this.showLoanDetails} />
      ),
      Failure: e => <Text>{e.description}</Text>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowHistory)
