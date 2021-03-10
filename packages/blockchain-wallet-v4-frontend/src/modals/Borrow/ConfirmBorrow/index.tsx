import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import {
  OfferType,
  PaymentValue,
  RatesType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class ConfirmBorrow extends PureComponent<Props> {
  state = {}

  handleSubmit = () => {
    this.props.borrowActions.createBorrow()
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success {...val} {...this.props} onSubmit={this.handleSubmit} />
      ),
      Failure: () => (
        <DataError
          onClick={() =>
            this.props.borrowActions.setStep({
              step: 'CHECKOUT',
              offer: this.props.offer
            })
          }
        />
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

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export type OwnProps = {
  handleClose: () => void
  offer: OfferType
}
export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}
export type SuccessStateType = {
  payment: PaymentValue
  rates: RatesType
}
export type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

export default enhance(ConfirmBorrow)
