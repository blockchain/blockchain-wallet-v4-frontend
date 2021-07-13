import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  ExtractSuccess,
  RemoteDataType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkedBanks extends PureComponent<Props> {
  componentDidMount() {
    this.props.custodialActions.fetchCustodialBeneficiaries()
    this.props.brokerageActions.fetchBankTransferAccounts()
    this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
  }

  render() {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Loading: () => <Loading />,
      Failure: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.withdraw.getFiatCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: WalletFiatType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ConnectedProps<typeof connector>

export default connector(LinkedBanks)
