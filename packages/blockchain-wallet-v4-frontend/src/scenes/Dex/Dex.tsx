import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { InjectedFormProps } from 'redux-form'
import { reduxForm } from 'redux-form'

import { actions, model, selectors } from 'data'
import { DexScenes, DexSwapForm } from 'data/components/dex/types'
import { notReachable } from 'utils/notReachable'

import { PageWrapper } from './components'
import { Onboarding } from './Onboarding'
import { ConfirmSwap } from './Swap/ConfirmSwap'
import { EnterSwapDetails } from './Swap/EnterSwapDetails'

const { DEX_SWAP_FORM } = model.components.dex

const DEX_INTRO_VIEWED_KEY = 'dexIntroViewed'

// With additional own Props: InjectedFormProps<FormData, Props> & Props and reduxForm<FormData, Props>
const Dex = (form: InjectedFormProps<DexSwapForm>) => {
  const dispatch = useDispatch()

  // TODO: Add proper currency union type
  const walletCurrency = useSelector(selectors.core.settings.getCurrency).getOrElse('USD')
  const swapFormValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const isAuthenticated = useSelector(selectors.auth.isAuthenticated)

  const [scene, setScene] = useState<DexScenes>(
    localStorage.getItem(DEX_INTRO_VIEWED_KEY) ? 'SWAP' : 'ONBOARDING'
  )

  useEffect(() => {
    dispatch(actions.components.dex.fetchChains())
    dispatch(actions.core.data.coins.fetchCoinsRates())
  }, [])

  const onGoBack = () => {
    setScene('SWAP')
    // TODO: Make a form fiend names / values type safe while migrating to final-form or another lib
    form.change('step', 'ENTER_DETAILS')
  }

  useEffect(() => {
    if (
      (swapFormValues.step === 'CONFIRM_SWAP' && !swapFormValues.baseToken) ||
      !swapFormValues.counterToken
    ) {
      onGoBack()
    }
  }, [swapFormValues.step, swapFormValues.baseToken, swapFormValues.counterToken])

  const onFinishOnboarding = () => {
    localStorage.setItem(DEX_INTRO_VIEWED_KEY, 'true')
    setScene('SWAP')
  }

  switch (scene) {
    case 'ONBOARDING':
      return (
        <PageWrapper>
          <Onboarding onClickStart={onFinishOnboarding} />
        </PageWrapper>
      )

    case 'SWAP':
      switch (swapFormValues.step) {
        case 'ENTER_DETAILS':
          return (
            <PageWrapper>
              <EnterSwapDetails isAuthenticated={isAuthenticated} walletCurrency={walletCurrency} />
            </PageWrapper>
          )

        case 'CONFIRM_SWAP':
          return (
            <PageWrapper>
              <ConfirmSwap walletCurrency={walletCurrency} onClickBack={onGoBack} />
            </PageWrapper>
          )

        default:
          return notReachable(swapFormValues.step)
      }

    default:
      return notReachable(scene)
  }
}

export default reduxForm<DexSwapForm>({
  destroyOnUnmount: false,
  enableReinitialize: true,
  form: DEX_SWAP_FORM,
  initialValues: { slippage: null, step: 'ENTER_DETAILS' }
})(Dex)
