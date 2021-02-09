import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import {
  FiatType,
  RemoteDataType,
  SBOrderActionType,
  SBOrderType,
  SBPairType
} from 'core/types'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Failure from '../../Brokerage/PaymentMethods/template.failure'
import Loading from '../template.loading'
import Success from './template.success'

class PaymentMethods extends PureComponent<Props> {
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBCards()
      this.props.brokerageActions.fetchBankTransferAccounts()
    }
  }

  handleBack = () => {}
  handleFailure = () => {}

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => {
        return (
          <Failure
            {...this.props}
            handleBack={this.handleBack}
            handleFailure={this.handleFailure}
          />
        )
      },
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'USD'
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
  orderType: SBOrderActionType
  pair: SBPairType
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: FiatType
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(PaymentMethods)
