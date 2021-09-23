import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  ExtractSuccess,
  RemoteDataType,
  WalletFiatType
} from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkedBanks extends PureComponent<Props> {
  componentDidMount() {
    this.props.custodialActions.fetchCustodialBeneficiaries()
    this.props.brokerageActions.fetchBankTransferAccounts()
    this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => null,
      Success: (val) => <Success {...this.props} {...val} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.withdraw.getFiatCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
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
