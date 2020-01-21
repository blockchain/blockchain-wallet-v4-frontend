import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { BorrowFormValuesType, PaymentType } from 'data/types'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'
import Loading from './template.loading'
import React, { Component } from 'react'
import Success from './template.success'

export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}

type LinkStatePropsType = {
  paymentR: RemoteData<string | Error, PaymentType>,
  values: BorrowFormValuesType
}

type Props = LinkDispatchPropsType & LinkStatePropsType

export class BorrowForm extends Component<Props> {
  state = {}

  componentDidMount () {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  render () {
    const { borrowActions, paymentR, values } = this.props

    return (
      paymentR.cata({
        Success: (val) => <Success {...val} {...this.props} />,
        Failure: () => 'Oops something went wrong.',
        Loading: () => <Loading />,
        NotAsked: () => <Loading />
      })
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  paymentR: selectors.components.borrow.getPayment(state),
  values: selectors.form.getFormValues('borrowForm')(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const enhance = compose<any>(
  reduxForm({ form: 'borrowForm' }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(BorrowForm)
