import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from '../template.loading'
import Success from './template.success'

class BillingAddress extends PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.initializeBillingAddress()
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.setStep({ step: 'ADD_CARD' })
  }

  render () {
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
