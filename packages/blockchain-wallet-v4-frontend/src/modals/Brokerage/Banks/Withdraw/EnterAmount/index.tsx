import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { SBPaymentTypes } from '@core/network/api/simpleBuy/types'
import {
  BeneficiaryType,
  CrossBorderLimitsPyload,
  ExtractSuccess,
  SBPaymentMethodType,
  WalletAcountEnum,
  WalletFiatType
} from '@core/types'
import { EnterAmount, FlyoutOopsError } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  BankPartners,
  BankTransferAccountType,
  BrokerageOrderType,
  WithdrawCheckoutFormValuesType,
  WithdrawStepEnum
} from 'data/types'

import getData from './selectors'
import Loading from './template.loading'

const EnterAmountContainer = (props: Props) => {
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

    // cross border limits
    const fromAccount = WalletAcountEnum.CUSTODIAL
    const toAccount = WalletAcountEnum.NON_CUSTODIAL
    props.withdrawActions.fetchCrossBorderLimits(
      props.fiatCurrency,
      fromAccount,
      props.fiatCurrency,
      toAccount
    )
  }, [props.fiatCurrency])

  const errorCallback = useCallback(() => {
    props.custodialActions.fetchCustodialBeneficiaries(props.fiatCurrency)
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

  const handleBankSelection = () => {
    if (props.userData.tiers.current === 2) {
      props.withdrawActions.setStep({
        fiatCurrency: props.fiatCurrency,
        step: WithdrawStepEnum.BANK_PICKER
      })
    } else {
      props.buySellActions.setStep({
        step: 'KYC_REQUIRED'
      })
    }
  }

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />
    ),
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => {
      const { crossBorderLimits } = val
      const bankTransferMethod = val.paymentMethods.methods.find((method) => {
        return method.type === SBPaymentTypes.BANK_TRANSFER
      })

      const bankAccountMethod = val.paymentMethods.methods.find((method) => {
        return method.type === SBPaymentTypes.BANK_ACCOUNT
      })

      const eligiblePaymentMethod = bankTransferMethod || bankAccountMethod

      if (!eligiblePaymentMethod) {
        return <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />
      }

      // Since payment method type needs to match with the payment account that we're using here
      // so we need to first check for the defaultMethod which is a BANK_TRANSFER type and then check
      // for beneficiary type which is a BANK_ACCOUNT type. It's worth noting that we also pass
      // these in a specific order "val.defaultMethod || props.beneficiary || val.defaultBeneficiary"
      // as the paymentAccount in the EnterAmount component which is necessary
      let selectedPaymentMethod: SBPaymentMethodType = eligiblePaymentMethod
      if (val.defaultMethod && bankTransferMethod) {
        selectedPaymentMethod = bankTransferMethod
      } else if ((props.beneficiary || val.defaultBeneficiary) && bankAccountMethod) {
        selectedPaymentMethod = bankAccountMethod
      }

      // console.log('formErrorsBrokerage', val.formErrorsBrokerage)

      return (
        <EnterAmount
          onSubmit={handleSubmit}
          initialValues={{ currency: props.fiatCurrency }}
          fee={val.fees.minorValue}
          fiatCurrency={props.fiatCurrency}
          handleBack={props.handleClose}
          handleMethodClick={handleBankSelection}
          orderType={BrokerageOrderType.WITHDRAW}
          paymentAccount={val.defaultMethod || props.beneficiary || val.defaultBeneficiary}
          paymentMethod={selectedPaymentMethod}
          withdrawableBalance={val.withdrawableBalance}
          minWithdrawAmount={val.minAmount.minorValue}
          crossBorderLimits={crossBorderLimits}
        />
      )
    }
  })
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  formValues: selectors.form.getFormValues('brokerageTx')(state) as WithdrawCheckoutFormValuesType,
  userData: selectors.modules.profile.getUserData(state).getOrFail('Unknown user')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
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

export default connector(EnterAmountContainer)
