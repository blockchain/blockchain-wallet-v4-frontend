import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { InjectedFormProps } from 'redux-form'
import { reduxForm } from 'redux-form'

import { model, selectors } from 'data'
import { DexSwapForm, DexSwapSteps } from 'data/components/dex/types'

import { PageWrapper } from '../components'
import CompleteSwap from './CompleteSwap'
import { ConfirmSwap } from './ConfirmSwap'
import { EnterSwapDetails } from './EnterSwapDetails'

const { DEFAULT_SLIPPAGE, DEX_SWAP_FORM } = model.components.dex

const SwapForm = (form: InjectedFormProps<DexSwapForm>) => {
  // TODO: Add proper currency type from @core/exchange/currencies to selector
  const walletCurrency = useSelector(selectors.core.settings.getCurrency).getOrElse('USD')
  const swapFormValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm

  const onGoBack = () => {
    // TODO: Make a form fiend names / values type safe while migrating to final-form or another lib
    form.change('step', DexSwapSteps.ENTER_DETAILS)
  }

  useEffect(() => {
    if (
      (swapFormValues.step === DexSwapSteps.CONFIRM_SWAP && !swapFormValues.baseToken) ||
      !swapFormValues.counterToken
    ) {
      onGoBack()
    }
  }, [swapFormValues.step, swapFormValues.baseToken, swapFormValues.counterToken])

  switch (swapFormValues.step) {
    case DexSwapSteps.CONFIRM_SWAP:
      return (
        <PageWrapper>
          <ConfirmSwap walletCurrency={walletCurrency} onClickBack={onGoBack} />
        </PageWrapper>
      )

    case DexSwapSteps.COMPLETE_SWAP:
      return (
        <PageWrapper>
          <CompleteSwap />
        </PageWrapper>
      )

    case DexSwapSteps.ENTER_DETAILS:
    default:
      return (
        <PageWrapper>
          <EnterSwapDetails walletCurrency={walletCurrency} />
        </PageWrapper>
      )
  }
}

export const Swap = reduxForm<DexSwapForm>({
  destroyOnUnmount: true,
  enableReinitialize: true,
  form: DEX_SWAP_FORM,
  initialValues: { slippage: DEFAULT_SLIPPAGE, step: DexSwapSteps.ENTER_DETAILS }
})(SwapForm)
