import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { BorrowMinMaxType, RatesType } from 'data/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import {
  LoanTransactionsType,
  LoanType,
  OfferType,
  PaymentValue,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class RepayLoan extends PureComponent<Props> {
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = {
  handleClose: () => void
  loan: LoanType
  offer: OfferType
}
export type SuccessStateType = {
  limits: BorrowMinMaxType
  loanTransactions: Array<LoanTransactionsType>
  payment: PaymentValue
  rates: RatesType
  supportedCoins: SupportedCoinsType
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(RepayLoan)
