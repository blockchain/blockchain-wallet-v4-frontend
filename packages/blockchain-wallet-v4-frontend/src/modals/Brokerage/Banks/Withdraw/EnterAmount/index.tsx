import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BSPaymentTypes } from '@core/network/api/buySell/types'
import {
  BeneficiaryType,
  BSPaymentMethodType,
  CrossBorderLimitsPayload,
  ExtractSuccess,
  WalletAccountEnum,
  WalletFiatType
} from '@core/types'
import { EnterAmount } from 'components/Flyout/Brokerage'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  Analytics,
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
    let paymentMethod: BSPaymentTypes | 'ALL' = 'ALL'
    if (props.defaultMethod) {
      paymentMethod = BSPaymentTypes.BANK_TRANSFER
      if (
        props.defaultMethod.partner !== BankPartners.YODLEE &&
        props.defaultMethod.currency === 'USD'
      ) {
        paymentMethod = BSPaymentTypes.BANK_ACCOUNT
      }
    }
    // We need to make this call each time we load the enter amount component
    // because the bank wires and ach have different min/max/fees
    props.withdrawActions.fetchWithdrawalFees({ paymentMethod })

    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankTransferAccounts()
      props.custodialActions.fetchCustodialBeneficiaries(props.fiatCurrency)
      props.withdrawActions.fetchWithdrawalLock({})
    }

    // cross border limits
    const fromAccount = WalletAccountEnum.CUSTODIAL
    const toAccount = WalletAccountEnum.NON_CUSTODIAL
    props.withdrawActions.fetchCrossBorderLimits({
      fromAccount,
      inputCurrency: props.fiatCurrency,
      outputCurrency: props.fiatCurrency,
      toAccount
    } as CrossBorderLimitsPayload)
  }, [props.fiatCurrency])

  const errorCallback = useCallback(() => {
    props.custodialActions.fetchCustodialBeneficiaries(props.fiatCurrency)
  }, [props.fiatCurrency])

  const handleSubmit = () => {
    const { defaultBeneficiary } = props.data.getOrElse({} as SuccessStateType)
    const { analyticsActions, defaultMethod, fiatCurrency, formValues } = props
    const { amount } = formValues
    const beneficiary = defaultBeneficiary || props.beneficiary

    analyticsActions.trackEvent({
      key: Analytics.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_ENTERED,
      properties: {
        amount: Number(amount),
        currency: fiatCurrency,
        withdrawal_method: defaultMethod ? 'BANK_ACCOUNT' : 'BANK_TRANSFER'
      }
    })

    if (!beneficiary && !defaultMethod) return

    if (defaultMethod) {
      props.withdrawActions.setStep({
        amount,
        defaultMethod: defaultMethod as BankTransferAccountType,
        step: WithdrawStepEnum.CONFIRM_WITHDRAW
      })
    } else if (defaultBeneficiary || props.beneficiary) {
      props.withdrawActions.setStep({
        amount,
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

  const handleMaxButtonClicked = () => {
    const { analyticsActions, defaultMethod, fiatCurrency, formValues } = props

    analyticsActions.trackEvent({
      key: Analytics.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_MAX_CLICKED,
      properties: {
        amount_currency: Number(formValues.amount),
        currency: fiatCurrency,
        withdrawal_method: defaultMethod ? 'BANK_ACCOUNT' : 'BANK_TRANSFER'
      }
    })
  }

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />
    ),
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => {
      const { crossBorderLimits, formErrors } = val
      const bankTransferMethod = val.paymentMethods.methods.find((method) => {
        return method.type === BSPaymentTypes.BANK_TRANSFER
      })

      const bankAccountMethod = val.paymentMethods.methods.find((method) => {
        return method.type === BSPaymentTypes.BANK_ACCOUNT
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
      let selectedPaymentMethod: BSPaymentMethodType = eligiblePaymentMethod
      if (val.defaultMethod && bankTransferMethod) {
        selectedPaymentMethod = bankTransferMethod
      } else if ((props.beneficiary || val.defaultBeneficiary) && bankAccountMethod) {
        selectedPaymentMethod = bankAccountMethod
      }

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
          formErrors={formErrors}
          formActions={props.formActions}
          onMaxButtonClicked={handleMaxButtonClicked}
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
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
