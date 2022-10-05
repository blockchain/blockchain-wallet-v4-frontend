import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BSPaymentMethodType } from '@core/network/api/buySell/types'
import { BSPaymentTypes, CrossBorderLimitsPayload, FiatType, WalletAccountEnum } from '@core/types'
import { EnterAmount } from 'components/Flyout/Brokerage'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { getDefaultMethod } from 'components/Flyout/model'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  AddBankStepType,
  BankDWStepType,
  BankPartners,
  BrokerageModalOriginType,
  BrokerageOrderType
} from 'data/types'

import { Loading, LoadingTextEnum } from '../../../../components'
import getData from './selectors'

const EnterAmountContainer = ({
  brokerageActions,
  buySellActions,
  data,
  defaultMethod,
  fiatCurrency,
  formActions,
  plaidEnabled
}: Props) => {
  useEffect(() => {
    if (fiatCurrency && !Remote.Success.is(data)) {
      buySellActions.fetchPaymentMethods(fiatCurrency)
      buySellActions.fetchFiatEligible(fiatCurrency)
      brokerageActions.fetchBankTransferAccounts()
      buySellActions.fetchSDDEligibility()
    }

    // fetch crossborder limits
    brokerageActions.fetchCrossBorderLimits({
      fromAccount: WalletAccountEnum.NON_CUSTODIAL,
      inputCurrency: fiatCurrency,
      outputCurrency: fiatCurrency,
      toAccount: WalletAccountEnum.CUSTODIAL
    } as CrossBorderLimitsPayload)
  }, [fiatCurrency])

  const onSubmit = () => {
    if (
      defaultMethod &&
      'partner' in defaultMethod &&
      defaultMethod.partner === BankPartners.YAPILY
    ) {
      brokerageActions.setDWStep({
        dwStep: BankDWStepType.AUTHORIZE
      })
    } else {
      brokerageActions.setDWStep({
        dwStep: BankDWStepType.CONFIRM
      })
    }
  }

  const errorCallback = useCallback(() => {
    brokerageActions.setDWStep({
      dwStep: BankDWStepType.DEPOSIT_METHODS
    })
  }, [])

  const handleBack = useCallback(
    () =>
      brokerageActions.setDWStep({
        dwStep: BankDWStepType.DEPOSIT_METHODS
      }),
    []
  )

  const handleChangeMethod = useCallback(() => {
    brokerageActions.setDWStep({
      dwStep: BankDWStepType.BANK_LIST
    })
  }, [])

  const handleAddMethod = useCallback(() => {
    const ACHProvider = plaidEnabled ? 'ADD_BANK_PLAID_MODAL' : 'ADD_BANK_YODLEE_MODAL'
    brokerageActions.showModal({
      modalType: fiatCurrency === 'USD' ? ACHProvider : 'ADD_BANK_YAPILY_MODAL',
      origin: BrokerageModalOriginType.ADD_BANK_DEPOSIT
    })
    brokerageActions.setAddBankStep({
      addBankStep: AddBankStepType.ADD_BANK
    })
  }, [fiatCurrency, plaidEnabled])

  return data.cata({
    Failure: () => (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={errorCallback}
      />
    ),
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => {
      const isUserEligible =
        val.paymentMethods.methods.length &&
        val.paymentMethods.methods.find((method) => method.limits.max !== '0')
      const paymentAccount = getDefaultMethod(defaultMethod, val.bankTransferAccounts)
      const paymentMethod = val.paymentMethods.methods.find((method) => {
        // if a payment account is selected, make sure the payment method matches up so limits are displayed correctly
        if (paymentAccount) {
          return paymentAccount.type === method.type
        }
        return (
          method.type === BSPaymentTypes.BANK_TRANSFER ||
          method.type === BSPaymentTypes.BANK_ACCOUNT
        )
      })
      let handleMethodClick: () => void
      const { crossBorderLimits, formErrors } = val

      if (val.bankTransferAccounts.length > 0) {
        handleMethodClick = handleChangeMethod
      } else {
        handleMethodClick = handleAddMethod
      }

      return isUserEligible && paymentMethod ? (
        <EnterAmount
          onSubmit={onSubmit}
          initialValues={{ currency: fiatCurrency }}
          fiatCurrency={fiatCurrency as FiatType}
          handleBack={handleBack}
          handleMethodClick={handleMethodClick}
          orderType={BrokerageOrderType.DEPOSIT}
          paymentAccount={paymentAccount}
          paymentMethod={paymentMethod}
          crossBorderLimits={crossBorderLimits}
          formErrors={formErrors}
          formActions={formActions}
        />
      ) : (
        <FlyoutOopsError
          action='retry'
          data-e2e='sbTryCurrencySelectionAgain'
          handler={errorCallback}
        />
      )
    }
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  defaultMethod: selectors.components.brokerage.getActiveAccount(state),
  fiatCurrency: selectors.components.brokerage.getFiatCurrency(state),
  plaidEnabled: selectors.core.walletOptions.getAddPlaidPaymentProvider(state).getOrElse(false)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method?: BSPaymentMethodType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmountContainer)
