import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import {
  CoinType,
  OfferType,
  PaymentValue,
  RatesType,
  RemoteDataType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { BorrowMinMaxType } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class BorrowForm extends PureComponent<Props> {
  state = {}

  componentDidMount() {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  handleRefresh = () => {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  handleSubmit = () => {
    this.props.borrowActions.setStep({
      step: 'CONFIRM',
      offer: this.props.offer
    })
  }

  render() {
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

export type OwnProps = {
  handleClose: () => void
  offer: OfferType
}

export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}

export type SuccessStateType = {
  coin: CoinType
  limits: BorrowMinMaxType
  payment: PaymentValue
  rates: RatesType
  supportedCoins: SupportedWalletCurrenciesType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(BorrowForm)
