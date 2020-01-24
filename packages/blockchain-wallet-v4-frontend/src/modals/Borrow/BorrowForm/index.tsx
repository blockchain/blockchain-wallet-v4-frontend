import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { OfferType, PaymentType, RatesType, RemoteDataType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { Component } from 'react'
import Success from './template.success'

export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}

export type SuccessStateType = {
  offers: Array<OfferType>
  payment: PaymentType
  rates: RatesType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = LinkDispatchPropsType & LinkStatePropsType

export class BorrowForm extends Component<Props> {
  state = {}

  componentDidMount () {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  handleRefresh = () => {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  handleSubmit = () => {
    this.props.borrowActions.createBorrow()
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

const enhance = compose<any>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(BorrowForm)
