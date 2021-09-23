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
    this.props.buySellActions.fetchPaymentMethods(this.props.walletCurrency)
  }

  handleBankClick = () => {
    // There is no reliable source of fiatCurrency so we depend on the withdrawal component for it
    // but if the userData has a limits currency that seems fairly reliable so we'll use that. It
    // limits is an empty array on tier 0 accounts but they're not eligible for banks anyways
    let { fiatCurrency } = this.props
    if (path(['userData', 'limits'], this.props)) {
      fiatCurrency = this.props.userData?.limits[0]?.currency as WalletFiatType
    }
    this.props.brokerageActions.showModal({
      modalType: fiatCurrency === 'USD' ? 'ADD_BANK_YODLEE_MODAL' : 'ADD_BANK_YAPILY_MODAL',
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
      NotAsked: () => null,
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
  fiatCurrency: selectors.components.withdraw.getFiatCurrency(state),
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
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
  userData: UserDataType
  walletCurrency: WalletFiatType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ConnectedProps<typeof connector>

export default connector(LinkedBanks)
