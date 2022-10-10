import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { path } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { ExtractSuccess, RemoteDataType, WalletFiatType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  AddBankStepType,
  BankTransferAccountType,
  BrokerageModalOriginType,
  UserDataType
} from 'data/types'

import getData from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkedBanks extends PureComponent<Props> {
  componentDidMount() {
    this.props.brokerageActions.fetchBankTransferAccounts()
    this.props.buySellActions.fetchPaymentMethods(this.props.tradingCurrency)
  }

  handleBankClick = () => {
    const { plaidEnabled, tradingCurrency } = this.props
    const ACHProvider = plaidEnabled ? 'ADD_BANK_PLAID_MODAL' : 'ADD_BANK_YODLEE_MODAL'
    this.props.brokerageActions.showModal({
      modalType: tradingCurrency === 'USD' ? ACHProvider : 'ADD_BANK_YAPILY_MODAL',
      origin: BrokerageModalOriginType.ADD_BANK_SETTINGS
    })

    this.props.brokerageActions.setAddBankStep({
      addBankStep: AddBankStepType.ADD_BANK
    })
  }

  handleShowBankClick = (account: BankTransferAccountType) => {
    this.props.brokerageActions.showModal({
      modalType: 'BANK_DETAILS_MODAL',
      origin: BrokerageModalOriginType.BANK
    })
    this.props.brokerageActions.setBankDetails({
      account
    })
  }

  handleDeleteBank = (account: BankTransferAccountType) => {
    this.props.brokerageActions.showModal({
      modalType: 'REMOVE_BANK_MODAL',
      origin: BrokerageModalOriginType.BANK
    })
    this.props.brokerageActions.setBankDetails({
      account
    })
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <Success
          {...this.props}
          {...val}
          handleBankClick={this.handleBankClick}
          handleShowBankClick={this.handleShowBankClick}
          handleDeleteBank={this.handleDeleteBank}
        />
      )
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  plaidEnabled: selectors.core.walletOptions.getAddPlaidPaymentProvider(state).getOrElse(false),
  tradingCurrency: selectors.modules.profile.getTradingCurrency(state).getOrElse('USD'),
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
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
  plaidEnabled: unknown | boolean
  tradingCurrency: WalletFiatType
  userData: UserDataType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ConnectedProps<typeof connector>

export default connector(LinkedBanks)
