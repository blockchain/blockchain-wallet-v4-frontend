import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'

import { Remote } from '@core'
import { BSPaymentTypes } from '@core/network/api/buySell/types'
import {
  BeneficiaryType,
  BSPaymentMethodType,
  ExtractSuccess,
  WalletAccountEnum,
  WalletFiatType
} from '@core/types'
import { EnterAmount } from 'components/Flyout/Brokerage'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { selectors } from 'data'
import { custodial } from 'data/actions'
import { trackEvent } from 'data/analytics/slice'
import { brokerage, buySell, withdraw } from 'data/components/actions'
import { RootState } from 'data/rootReducer'
import {
  Analytics,
  BankPartners,
  BankTransferAccountType,
  BrokerageOrderType,
  WithdrawCheckoutFormValuesType,
  WithdrawStepEnum
} from 'data/types'

import WithdrawLoading from '../WithdrawLoading'
import getData from './selectors'

const EnterAmountContainer = (props: Props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    let paymentMethod: BSPaymentTypes | 'ALL' = 'ALL'
    if (props.defaultMethod) {
      paymentMethod = BSPaymentTypes.BANK_TRANSFER
      // TODO: this logic is too specific, needs to be abstracted
      if (
        props.defaultMethod.partner !== BankPartners.YODLEE &&
        props.defaultMethod.partner !== BankPartners.PLAID &&
        props.defaultMethod.currency === 'USD'
      ) {
        paymentMethod = BSPaymentTypes.BANK_ACCOUNT
      }
    }
    // We need to make this call each time we load the enter amount component
    // because the bank wires and ach have different min/max/fees
    dispatch(withdraw.fetchWithdrawalFees({ paymentMethod }))

    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      dispatch(brokerage.fetchBankTransferAccounts())
      dispatch(custodial.fetchCustodialBeneficiaries({ currency: props.fiatCurrency }))
      dispatch(withdraw.fetchWithdrawalLock({}))
    }

    // cross border limits
    const fromAccount = WalletAccountEnum.CUSTODIAL
    const toAccount = WalletAccountEnum.NON_CUSTODIAL

    dispatch(
      withdraw.fetchCrossBorderLimits({
        fromAccount,
        inputCurrency: props.fiatCurrency,
        outputCurrency: props.fiatCurrency,
        toAccount
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fiatCurrency])

  const errorCallback = useCallback(() => {
    dispatch(custodial.fetchCustodialBeneficiaries({ currency: props.fiatCurrency }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fiatCurrency])

  const handleSubmit =
    (paymentAccount: BankTransferAccountType | BeneficiaryType | undefined) => () => {
      if (!paymentAccount) return
      const { fiatCurrency, formValues } = props
      const { amount } = formValues

      dispatch(
        trackEvent({
          key: Analytics.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_ENTERED,
          properties: {
            amount: Number(amount),
            currency: fiatCurrency,
            withdrawal_method: 'agent' in paymentAccount ? 'BANK_ACCOUNT' : 'BANK_TRANSFER'
          }
        })
      )

      // BANK_ACCOUNT type
      if ('agent' in paymentAccount) {
        dispatch(
          withdraw.setStep({
            amount,
            beneficiary: paymentAccount,
            step: WithdrawStepEnum.CONFIRM_WITHDRAW
          })
        )
      }

      // BANK_TRANSFER type
      if ('partner' in paymentAccount) {
        dispatch(
          withdraw.setStep({
            amount,
            defaultMethod: paymentAccount,
            step: WithdrawStepEnum.CONFIRM_WITHDRAW
          })
        )
      }
    }

  const handleBankSelection = () => {
    if (props.userCurrentTier === 2) {
      dispatch(
        withdraw.setStep({
          fiatCurrency: props.fiatCurrency,
          step: WithdrawStepEnum.BANK_PICKER
        })
      )
    } else {
      dispatch(buySell.setStep({ step: 'KYC_REQUIRED' }))
    }
  }

  const handleMaxButtonClicked = () => {
    const { defaultMethod, fiatCurrency, formValues } = props

    dispatch(
      trackEvent({
        key: Analytics.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_MAX_CLICKED,
        properties: {
          amount_currency: Number(formValues.amount),
          currency: fiatCurrency,
          withdrawal_method: defaultMethod ? 'BANK_ACCOUNT' : 'BANK_TRANSFER'
        }
      })
    )
  }

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={errorCallback} />
    ),
    Loading: () => <WithdrawLoading />,
    NotAsked: () => <WithdrawLoading />,
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

      let paymentAccount = val.defaultMethod || props.beneficiary || val.defaultBeneficiary
      if (!paymentAccount || paymentAccount.currency !== props.fiatCurrency) {
        paymentAccount = undefined
      }

      // Connecting the paymentAccount to the submit handler here because there's some nasty logic
      // above here to determine the account being used to withdraw to. This should all ideally be refactored
      const submitter = handleSubmit(paymentAccount)

      return (
        <EnterAmount
          crossBorderLimits={crossBorderLimits}
          fee={val.fees.minorValue}
          fiatCurrency={props.fiatCurrency}
          formErrors={formErrors}
          handleBack={props.handleClose}
          handleMethodClick={handleBankSelection}
          initialValues={{ currency: props.fiatCurrency }}
          minWithdrawAmount={val.minAmount.minorValue}
          onMaxButtonClicked={handleMaxButtonClicked}
          onSubmit={submitter}
          orderType={BrokerageOrderType.WITHDRAW}
          paymentAccount={paymentAccount}
          paymentMethod={selectedPaymentMethod}
          withdrawableBalance={val.withdrawableBalance}
        />
      )
    }
  })
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  formValues: selectors.form.getFormValues('brokerageTx')(state) as WithdrawCheckoutFormValuesType,
  userCurrentTier: selectors.modules.profile.getCurrentTier(state).getOrElse(0)
})

const connector = connect(mapStateToProps)

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
