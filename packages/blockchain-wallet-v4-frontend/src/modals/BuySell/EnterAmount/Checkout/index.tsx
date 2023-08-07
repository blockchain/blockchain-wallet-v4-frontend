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
import { RootState } from 'data/rootReducer'
import { Analytics, BSCheckoutFormValuesType, ModalName, RecurringBuyPeriods } from 'data/types'
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
  >(getData)

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

    const { hasPaymentAccount } = data

    const buySellGoal = find(propEq('name', 'buySell'), goals)

    const id = propOr('', 'id', buySellGoal)

    if (!isEmpty(id)) {
      props.deleteGoal(String(id))
    }

    const method = props.method || props.defaultMethod

    props.analyticsActions.trackEvent({
      key: Analytics.BUY_AMOUNT_SCREEN_NEXT_CLICKED,
      properties: {
        input_amount: formValues?.amount,
        input_currency: props.fiatCurrency,
        output_currency: props.cryptoCurrency,
        payment_method: method?.type
      }
    })

    if (!method) {
      const nextStep = hasPaymentAccount ? 'LINKED_PAYMENT_ACCOUNTS' : 'PAYMENT_METHODS'
      props.buySellActions.setStep({
        cryptoCurrency: props.cryptoCurrency,
        fiatCurrency: props.fiatCurrency,
        order: props.order,
        pair: props.pair,
        step: nextStep
      })
    } else if (formValues && method) {
      switch (method.type) {
        case BSPaymentTypes.PAYMENT_CARD:
          if (props.mobilePaymentMethod) {
            props.buySellActions.proceedToBuyConfirmation({
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
          props.buySellActions.proceedToBuyConfirmation({
            paymentMethodId: method.id,
            paymentType: BSPaymentTypes.PAYMENT_CARD
          })
          break
        case BSPaymentTypes.FUNDS:
          props.buySellActions.proceedToBuyConfirmation({
            paymentType: BSPaymentTypes.FUNDS
          })
          break
        case BSPaymentTypes.BANK_TRANSFER:
          props.buySellActions.proceedToBuyConfirmation({
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
    props.buySellActions.returnToCryptoSelection()
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
      fix: preferences[OrderType.BUY].fix,
      orderType: OrderType.BUY,
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
      props.brokerageActions.fetchBankTransferAccounts()
    }
    // we fetch limits as part of home banners logic at that point we had only fiatCurrency
    // here we have to re-fetch for crypto currency and order type
    props.buySellActions.fetchLimits({
      cryptoCurrency: props.cryptoCurrency,
      currency: props.fiatCurrency,
      side: OrderType.BUY
    })

    // fetch cross border limits
    props.buySellActions.fetchCrossBorderLimits({
      fromAccount: WalletAccountEnum.CUSTODIAL,
      inputCurrency: props.fiatCurrency,
      outputCurrency: props.cryptoCurrency,
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
      {...props}
      {...data}
      formValues={formValues}
      isPristine={isPristine}
      onSubmit={handleSubmit}
    />
  )
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
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
