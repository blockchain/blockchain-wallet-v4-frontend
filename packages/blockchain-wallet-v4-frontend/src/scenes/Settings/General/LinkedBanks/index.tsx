import { actions, selectors } from 'data'
import { AddBankStepType, BrokerageModalOriginType } from 'data/types'
import {
  BankTransferAccountType,
  ExtractSuccess,
  RemoteDataType,
  WalletFiatType
} from 'core/types'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class LinkedBanks extends PureComponent<Props> {
  componentDidMount () {
    this.props.brokerageActions.fetchBankTransferAccounts()
    this.props.simpleBuyActions.fetchSBPaymentMethods()
  }

  handleBankClick = () => {
    this.props.brokerageActions.showModal(
      BrokerageModalOriginType.ADD_BANK,
      'ADD_BANK_MODAL'
    )
    this.props.brokerageActions.setStep({
      step: AddBankStepType.ADD_BANK
    })
  }

  handleShowBankClick = (account: BankTransferAccountType) => {
    this.props.brokerageActions.showModal(
      BrokerageModalOriginType.BANK,
      'BANK_PREVIEW_MODAL'
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

  render () {
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
