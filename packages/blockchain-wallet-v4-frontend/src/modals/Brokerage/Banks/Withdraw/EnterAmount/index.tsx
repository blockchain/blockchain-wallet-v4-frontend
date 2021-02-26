import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import {
  BankTransferAccountType,
  BeneficiaryType,
  ExtractSuccess,
  WalletFiatType
} from 'core/types'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { UserDataType, WithdrawCheckoutFormValuesType } from 'data/types'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

class EnterAmount extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.brokerageActions.fetchBankTransferAccounts()
      this.props.custodialActions.fetchCustodialBeneficiaries(
        this.props.fiatCurrency
      )
      this.props.withdrawActions.fetchWithdrawalFees()
      this.props.withdrawActions.fetchWithdrawalLock()
    }
  }

  handleSubmit = () => {
    const { defaultBeneficiary } = this.props.data.getOrElse(
      {} as SuccessStateType
    )
    const { defaultMethod } = this.props
    const beneficiary = defaultBeneficiary || this.props.beneficiary

    if (!beneficiary && !defaultMethod) return

    if (defaultMethod) {
      this.props.withdrawActions.setStep({
        step: 'CONFIRM_WITHDRAW',
        amount: this.props.formValues.amount,
        defaultMethod
      })
    } else if (defaultBeneficiary || this.props.beneficiary) {
      this.props.withdrawActions.setStep({
        step: 'CONFIRM_WITHDRAW',
        amount: this.props.formValues.amount,
        beneficiary
      })
    }
  }

  handleBankSelection = (
    userData: UserDataType,
    beneficiary?: BeneficiaryType | BankTransferAccountType
  ) => {
    if (!beneficiary) {
      this.props.simpleBuyActions.showModal('WithdrawModal')
      if (userData.tiers.current === 2) {
        return this.props.simpleBuyActions.setStep({
          step: 'BANK_WIRE_DETAILS',
          fiatCurrency: this.props.fiatCurrency,
          displayBack: false,
          addBank: true
        })
      } else {
        return this.props.simpleBuyActions.setStep({
          step: 'KYC_REQUIRED'
        })
      }
    }

    this.props.withdrawActions.setStep({
      step: 'BANK_PICKER',
      fiatCurrency: this.props.fiatCurrency
    })
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          onSubmit={this.handleSubmit}
          handleBankSelection={this.handleBankSelection}
        />
      ),
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  formValues: selectors.form.getFormValues('custodyWithdrawForm')(
    state
  ) as WithdrawCheckoutFormValuesType,
  defaultMethod: selectors.components.brokerage.getAccount(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  beneficiary?: BeneficiaryType
  defaultMethod?: BankTransferAccountType
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | false }
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
