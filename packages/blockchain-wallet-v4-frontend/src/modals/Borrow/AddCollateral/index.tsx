import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { BorrowMinMaxType, PaymentType, RatesType } from 'data/types'
import {
  CoinType,
  LoanType,
  OfferType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { Component } from 'react'
import Success from './template.success'

export type OwnProps = {
  loan: LoanType
}

export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}

export type SuccessStateType = {
  coin: CoinType
  limits: BorrowMinMaxType
  offer: OfferType
  payment: PaymentType
  rates: RatesType
  supportedCoins: SupportedCoinsType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class BorrowForm extends Component<Props> {
  state = {}

  componentDidMount () {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  handleRefresh = () => {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  handleSubmit = () => {
    this.props.borrowActions.addCollateral(this.props.loan)
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: val => (
        <Success {...val} {...this.props} onSubmit={this.handleSubmit} />
      ),
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(BorrowForm)
