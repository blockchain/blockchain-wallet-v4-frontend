import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  BankTransferAccountType,
  ExtractSuccess,
  RemoteDataType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, BrokerageModalOriginType } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkedBanks extends PureComponent<Props> {
  componentDidMount() {
    this.props.brokerageActions.fetchBankTransferAccounts()
    this.props.simpleBuyActions.fetchSBPaymentMethods()
  }

  handleBankClick = () => {
    this.props.brokerageActions.showModal(
      BrokerageModalOriginType.ADD_BANK,
      'ADD_BANK_MODAL'
    )
    this.props.brokerageActions.setAddBankStep({
      addBankStep: AddBankStepType.ADD_BANK
    })
  }

  handleShowBankClick = (account: BankTransferAccountType) => {
    this.props.brokerageActions.showModal(
      BrokerageModalOriginType.BANK,
      'BANK_DETAILS_MODAL'
    )
    this.props.brokerageActions.setBankDetails({
      account
    })
  }

  handleDeleteBank = (account: BankTransferAccountType) => {
    this.props.brokerageActions.showModal(
      BrokerageModalOriginType.BANK,
      'REMOVE_BANK_MODAL'
    )
    this.props.brokerageActions.setBankDetails({
      account
    })
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          handleBankClick={this.handleBankClick}
          handleShowBankClick={this.handleShowBankClick}
          handleDeleteBank={this.handleDeleteBank}
        />
      ),
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
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: WalletFiatType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(LinkedBanks)
