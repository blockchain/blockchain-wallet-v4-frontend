import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { InjectedFormProps } from 'redux-form'
import { reduxForm } from 'redux-form'

import { model, selectors } from 'data'
import { DexSwapForm } from 'data/components/dex/types'
import { notReachable } from 'utils/helpers'

import { PageWrapper } from '../components'
import CompleteSwap from './CompleteSwap'
import { ConfirmSwap } from './ConfirmSwap'
import { EnterSwapDetails } from './EnterSwapDetails'

const {
  DEFAULT_SLIPPAGE,
  DEX_COMPLETE_SWAP_STEP,
  DEX_CONFIRM_SWAP_STEP,
  DEX_ENTER_DETAILS_STEP,
  DEX_SWAP_FORM
} = model.components.dex

const SwapForm = (form: InjectedFormProps<DexSwapForm>) => {
  // TODO: Add proper currency type from @core/exchange/currencies to selector
  const walletCurrency = useSelector(selectors.core.settings.getCurrency).getOrElse('USD')
  const swapFormValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm

  const onGoBack = () => {
    // TODO: Make a form fiend names / values type safe while migrating to final-form or another lib
    form.change('step', DEX_ENTER_DETAILS_STEP)
  }

  useEffect(() => {
    if (
      (swapFormValues.step === DEX_CONFIRM_SWAP_STEP && !swapFormValues.baseToken) ||
      !swapFormValues.counterToken
    ) {
      onGoBack()
    }
  }, [swapFormValues.step, swapFormValues.baseToken, swapFormValues.counterToken])

  switch (swapFormValues.step) {
    case DEX_ENTER_DETAILS_STEP:
      return (
        <PageWrapper>
          <EnterSwapDetails walletCurrency={walletCurrency} />
        </PageWrapper>
      )

    case DEX_CONFIRM_SWAP_STEP:
      return (
        <PageWrapper>
          <ConfirmSwap walletCurrency={walletCurrency} onClickBack={onGoBack} />
        </PageWrapper>
      )

    case DEX_COMPLETE_SWAP_STEP:
      return (
        <PageWrapper>
          <CompleteSwap />
        </PageWrapper>
      )

    default:
      return notReachable(swapFormValues.step)
  }
}

export const Swap = reduxForm<DexSwapForm>({
  destroyOnUnmount: true,
  enableReinitialize: true,
  form: DEX_SWAP_FORM,
  initialValues: { slippage: DEFAULT_SLIPPAGE, step: DEX_ENTER_DETAILS_STEP }
})(SwapForm)
