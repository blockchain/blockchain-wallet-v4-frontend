import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

class BillingAddress extends PureComponent<Props> {
  componentDidMount() {
    this.props.simpleBuyActions.initializeBillingAddress()
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.setStep({ step: 'ADD_CARD' })
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success {...val} {...this.props} onSubmit={this.handleSubmit} />
      ),
      Loading: () => <Loading />,
      Failure: () => (
        <DataError
          onClick={() =>
            this.props.simpleBuyActions.setStep({ step: 'ADD_CARD' })
          }
        />
      ),
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = ReturnType<typeof getData>['data']
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BillingAddress)
