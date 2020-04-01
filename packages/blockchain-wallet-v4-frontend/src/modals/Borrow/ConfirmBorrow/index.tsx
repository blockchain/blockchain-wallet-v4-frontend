import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { OfferType, PaymentValue, RemoteDataType } from 'core/types'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

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

class ConfirmBorrow extends PureComponent<Props> {
  state = {}

  handleSubmit = () => {
    this.props.borrowActions.createBorrow()
  }

  render () {
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

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ConfirmBorrow)
