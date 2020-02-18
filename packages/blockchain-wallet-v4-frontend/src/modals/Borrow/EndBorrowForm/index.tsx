import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { BorrowMinMaxType, PaymentType, RatesType } from 'data/types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import {
  LoanType,
  OfferType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
  loan: LoanType
  offer: OfferType
}
export type SuccessStateType = {
  limits: BorrowMinMaxType
  payment: PaymentType
  rates: RatesType
  supportedCoins: SupportedCoinsType
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class EndBorrowForm extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.borrowActions.initializeRepayLoan('PAX')
  }

  handleRefresh = () => {
    this.props.borrowActions.initializeRepayLoan('PAX')
  }

  handleSubmit = () => {
    this.props.borrowActions.repayLoan()
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...val} {...this.props} onSubmit={this.handleSubmit} />
      ),
      Failure: e => (
        <DataError message={{ message: e }} onClick={this.handleRefresh} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EndBorrowForm)
