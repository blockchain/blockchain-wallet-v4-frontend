import React, { useEffect, useRef } from 'react'
import { connect, ConnectedProps, useSelector } from 'react-redux'
import { find, isEmpty, pathOr, propEq, propOr } from 'ramda'
import { bindActionCreators } from 'redux'

import {
  BSPaymentTypes,
  CrossBorderLimitsPayload,
  ExtractSuccess,
  FiatType,
  OrderType,
  WalletAccountEnum
} from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, model, selectors } from 'data'
import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import { getValidPaymentMethod } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import {
  Analytics,
  BSCheckoutFormValuesType,
  ModalName,
  RecurringBuyPeriods,
  SwapBaseCounterTypes
} from 'data/types'
import { useRemote } from 'hooks'
import { isNabuError } from 'services/errors'

import Loading from '../../template.loading'
import {
  OwnProps as EnterAmountOwnProps,
  SuccessStateType as EnterAmountSuccessStateType
} from '../index'
import getData from './selectors'
import Success from './template.success'

const { FORM_BS_CHECKOUT } = model.components.buySell

const Checkout = (props: Props) => {
  const { data, error, isLoading, isNotAsked } = useRemote<
    string | PartialClientErrorProperties | undefined,
    ExtractSuccess<ReturnType<typeof getData>>,
    RootState
  >((state) => getData(state, props))

  const formValues = useSelector((state: RootState) =>
    selectors.form.getFormValues(FORM_BS_CHECKOUT)(state)
  ) as BSCheckoutFormValuesType
  const goals = useSelector((state: RootState) => selectors.goals.getGoals(state))
  const isPristine = useSelector((state: RootState) =>
    selectors.form.isPristine(FORM_BS_CHECKOUT)(state)
  )
  const preferences = useSelector((state: RootState) =>
    selectors.preferences.getBSCheckoutPreferences(state)
  )

  const methodRef = useRef<string>()

  const handleSubmit = () => {
    if (!data) return

    // if the user is < tier 2 go to kyc but save order info
    // if the user is tier 2 try to submit order, let BE fail
    const { hasPaymentAccount, isSddFlow, userData } = data

    const buySellGoal = find(propEq('name', 'buySell'), goals)

    const id = propOr('', 'id', buySellGoal)

    if (!isEmpty(id)) {
      props.deleteGoal(String(id))
    }

    const method = props.method || props.defaultMethod

    // TODO: sell
    // need to do kyc check
    // SELL
    if (formValues?.orderType === OrderType.SELL) {
      return props.buySellActions.setStep({
        sellOrderType: props.swapAccount?.type,
        step: 'PREVIEW_SELL'
      })
    }

    // BUY
    if (isSddFlow) {
      const currentTier = userData?.tiers?.current
      if (currentTier === 2 || currentTier === 1) {
        // user in SDD but already completed eligibility check, continue to payment
        props.buySellActions.createOrder({ paymentType: BSPaymentTypes.PAYMENT_CARD })
      } else {
        // user in SDD but needs to confirm KYC and SDD eligibility
        props.identityVerificationActions.verifyIdentity({
          checkSddEligibility: true,
          needMoreInfo: false,
          onCompletionCallback: () =>
            props.buySellActions.createOrder({ paymentType: BSPaymentTypes.PAYMENT_CARD }),
          origin: 'BuySell',
          tier: 2
        })
      }
    } else if (!method) {
      const nextStep = hasPaymentAccount ? 'LINKED_PAYMENT_ACCOUNTS' : 'PAYMENT_METHODS'
      props.buySellActions.setStep({
        cryptoCurrency: props.cryptoCurrency,
        fiatCurrency: props.fiatCurrency,
        order: props.order,
        pair: props.pair,
        step: nextStep
      })
    } else if (userData.tiers.current < 2) {
      props.buySellActions.createOrder({ paymentMethodId: getValidPaymentMethod(method.type) })
    } else if (formValues && method) {
      switch (method.type) {
        case BSPaymentTypes.PAYMENT_CARD:
          if (props.mobilePaymentMethod) {
            props.buySellActions.createOrder({
              mobilePaymentMethod: props.mobilePaymentMethod,
              paymentMethodId: method.id,
              paymentType: BSPaymentTypes.PAYMENT_CARD
            })

            break
          }

          props.buySellActions.setStep({
            step: 'DETERMINE_CARD_PROVIDER'
          })
          break
        case BSPaymentTypes.USER_CARD:
          props.buySellActions.createOrder({
            paymentMethodId: method.id,
            paymentType: BSPaymentTypes.PAYMENT_CARD
          })
          break
        case BSPaymentTypes.FUNDS:
          props.buySellActions.createOrder({ paymentType: BSPaymentTypes.FUNDS })
          break
        case BSPaymentTypes.BANK_TRANSFER:
          props.buySellActions.createOrder({
            paymentMethodId: method.id,
            paymentType: BSPaymentTypes.BANK_TRANSFER
          })
          break
        case BSPaymentTypes.BANK_ACCOUNT:
          break
        default:
          break
      }
    }
  }

  const errorCallback = () => {
    props.buySellActions.setStep({
      fiatCurrency: props.fiatCurrency,
      step: 'CRYPTO_SELECTION'
    })
  }

  useEffect(() => {
    const dataGoal = find(propEq('name', 'buySell'), goals)
    const goalAmount = pathOr('', ['data', 'amount'], dataGoal)
    const amount = goalAmount || formValues?.amount
    const cryptoAmount = formValues?.cryptoAmount
    const period = formValues?.period || RecurringBuyPeriods.ONE_TIME

    props.buySellActions.initializeCheckout({
      account: props.swapAccount,
      amount,
      cryptoAmount,
      fix: preferences[props.orderType].fix,
      orderType: props.orderType,
      pair: props.pair,
      pairs: props.pairs,
      period
    })

    // If no method was given but we have a default method, set it in redux
    // and the rest of the BS flow works much better
    if (!props.method && props.defaultMethod) {
      props.buySellActions.setMethod(props.defaultMethod)
    }

    if (!data) {
      props.buySellActions.fetchSDDEligibility()
      props.buySellActions.fetchCards(false)
      props.brokerageActions.fetchBankTransferAccounts()
      props.recurringBuyActions.fetchPaymentInfo()
    }
    // we fetch limits as part of home banners logic at that point we had only fiatCurrency
    // here we have to re-fetch for crypto currency and order type
    props.buySellActions.fetchLimits({
      cryptoCurrency: props.cryptoCurrency,
      currency: props.fiatCurrency,
      side: props.orderType || OrderType.BUY
    })

    const swapFromAccount =
      props.swapAccount?.type === SwapBaseCounterTypes.ACCOUNT
        ? WalletAccountEnum.NON_CUSTODIAL
        : WalletAccountEnum.CUSTODIAL
    // fetch cross border limits
    props.buySellActions.fetchCrossBorderLimits({
      fromAccount:
        props.orderType === OrderType.BUY ? WalletAccountEnum.CUSTODIAL : swapFromAccount,
      inputCurrency: props.orderType === OrderType.BUY ? props.fiatCurrency : props.cryptoCurrency,
      outputCurrency: props.orderType === OrderType.BUY ? props.cryptoCurrency : props.fiatCurrency,
      toAccount: WalletAccountEnum.CUSTODIAL
    } as CrossBorderLimitsPayload)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // check to see if there was no default method and now there is, then fire analytics event
    // we only really want this analytics event to trigger when the user opens the buy modal and
    // a default payment method is automatically used
    if (props.defaultMethod && props.defaultMethod?.id !== methodRef.current) {
      methodRef.current = props.defaultMethod?.id

      props.buySellActions.defaultMethodEvent(props.defaultMethod)
    }
  }, [props.buySellActions, props.defaultMethod])

  if (error) {
    if (isNabuError(error)) {
      return <GenericNabuErrorFlyout error={error} onDismiss={errorCallback} />
    }

    return (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={errorCallback}
        errorMessage={error}
      />
    )
  }

  if (isNotAsked) {
    return null
  }

  if (isLoading) {
    return <Loading />
  }

  if (!data) {
    return null
  }

  return (
    <Success
      formValues={formValues}
      isPristine={isPristine}
      preferences={preferences}
      {...props}
      {...data}
      onSubmit={handleSubmit}
    />
  )
}

const mapDispatchToProps = (dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  deleteGoal: (id: string) => dispatch(actions.goals.deleteGoal(id)),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch),
  showUpgradeModal: () => {
    dispatch(
      actions.modals.showModal(ModalName.UPGRADE_NOW_SILVER_MODAL, {
        origin: 'BuySellInit'
      })
    )
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.ONBOARDING_GET_MORE_ACCESS_WHEN_YOU_VERIFY,
        properties: {
          flow_step: 'BUY'
        }
      })
    )
  }
})

const connector = connect(null, mapDispatchToProps)

export type OwnProps = EnterAmountOwnProps &
  EnterAmountSuccessStateType & { cryptoCurrency: string; fiatCurrency: FiatType }
export type SuccessStateType = ReturnType<typeof getData>['data'] & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | boolean }
  hasPaymentAccount: boolean
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Checkout)
