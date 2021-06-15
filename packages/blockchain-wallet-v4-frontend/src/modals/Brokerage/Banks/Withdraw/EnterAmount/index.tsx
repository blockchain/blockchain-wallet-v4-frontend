import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { SBPaymentTypes } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { BeneficiaryType, ExtractSuccess, WalletFiatType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  BankPartners,
  BankTransferAccountType,
  UserDataType,
  WithdrawCheckoutFormValuesType,
  WithdrawStepEnum
} from 'data/types'

import { getData } from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

const EnterAmount = (props: Props) => {
  useEffect(() => {
    let paymentMethod: SBPaymentTypes | 'ALL' = 'ALL'
    if (props.defaultMethod) {
      paymentMethod = SBPaymentTypes.BANK_TRANSFER
      if (
        props.defaultMethod.partner !== BankPartners.YODLEE &&
        props.defaultMethod.currency === 'USD'
      ) {
        paymentMethod = SBPaymentTypes.BANK_ACCOUNT
      }
    }
    // We need to make this call each time we load the enter amount component
    // because the bank wires and ach have different min/max/fees
    props.withdrawActions.fetchWithdrawalFees(paymentMethod)

    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankTransferAccounts()
      props.custodialActions.fetchCustodialBeneficiaries(props.fiatCurrency)
      props.withdrawActions.fetchWithdrawalLock()
    }
  }, [props.fiatCurrency])

  const handleSubmit = () => {
    const { defaultBeneficiary } = props.data.getOrElse({} as SuccessStateType)
    const { defaultMethod } = props
    const beneficiary = defaultBeneficiary || props.beneficiary

    if (!beneficiary && !defaultMethod) return

    if (defaultMethod) {
      props.withdrawActions.setStep({
        amount: props.formValues.amount,
        defaultMethod: defaultMethod as BankTransferAccountType,
        step: WithdrawStepEnum.CONFIRM_WITHDRAW
      })
    } else if (defaultBeneficiary || props.beneficiary) {
      props.withdrawActions.setStep({
        amount: props.formValues.amount,
        beneficiary,
        step: WithdrawStepEnum.CONFIRM_WITHDRAW
      })
    }
  }

  const handleBankSelection = (
    userData: UserDataType,
    beneficiary?: BeneficiaryType | BankTransferAccountType
  ) => {
    if (!beneficiary) {
      props.simpleBuyActions.showModal('WithdrawModal')
      if (userData.tiers.current === 2) {
        return props.simpleBuyActions.setStep({
          addBank: true,
          displayBack: false,
          fiatCurrency: props.fiatCurrency,
          step: 'BANK_WIRE_DETAILS'
        })
      }
      return props.simpleBuyActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }

    props.withdrawActions.setStep({
      fiatCurrency: props.fiatCurrency,
      step: WithdrawStepEnum.BANK_PICKER
    })
  }

  return props.data.cata({
    Failure: () => <Failure {...props} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => (
      <Success
        {...props}
        {...val}
        onSubmit={handleSubmit}
        handleBankSelection={handleBankSelection}
      />
    )
  })
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  formValues: selectors.form.getFormValues('custodyWithdrawForm')(
    state
  ) as WithdrawCheckoutFormValuesType
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
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | false }
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
