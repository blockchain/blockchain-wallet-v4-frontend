import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  LoanTransactionsType,
  LoanType,
  OfferType,
  PaymentValue,
  RatesType,
  RemoteDataType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { BorrowMinMaxType } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class RepayLoan extends PureComponent<Props> {
  componentDidMount() {
    this.props.borrowActions.initializeRepayLoan('PAX')
  }

  handleRefresh = () => {
    this.props.borrowActions.initializeRepayLoan('PAX')
  }

  handleSubmit = () => {
    this.props.borrowActions.repayLoan()
  }

  render() {
    return this.props.data.cata({
      Failure: (e) => <DataError message={{ message: e }} onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...val} {...this.props} onSubmit={this.handleSubmit} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
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
export type SuccessStateType = {
  limits: BorrowMinMaxType
  loanTransactions: Array<LoanTransactionsType>
  payment: PaymentValue
  rates: RatesType
  supportedCoins: SupportedWalletCurrenciesType
}
type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(RepayLoan)
