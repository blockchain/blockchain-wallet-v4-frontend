import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { LoanType, OfferType } from 'core/types'
import { RootState } from 'data/rootReducer'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class BorrowDetails extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.borrowActions.setCoin(this.props.offer.terms.collateralCcy)
    this.props.borrowActions.fetchLoanTransactions(this.props.loan.loanId)
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: e => (typeof e === 'object' ? e.message : e),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
  loan: LoanType
  offer: OfferType
}
export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BorrowDetails)
