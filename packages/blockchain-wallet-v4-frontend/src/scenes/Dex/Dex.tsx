import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { reduxForm } from 'redux-form'

import { actions, model, selectors } from 'data'
import { DexScenes, DexSwapForm, DexSwapSteps } from 'data/components/dex/types'
import { RootState } from 'data/rootReducer'
import { notReachable } from 'utils/notReachable'

import { FormWrapper, PageWrapper } from './Dex.model'
import { Onboarding } from './Onboarding'
import ConfirmSwap from './Swap/ConfirmSwap'
import EnterSwapDetails from './Swap/EnterSwapDetails'

const { DEX_INTRO_VIEWED_KEY, DEX_SWAP_FORM } = model.components.dex

const Dex = ({ dexActions, formValues, ratesActions }: Props) => {
  useEffect(() => {
    dexActions.fetchChains()
    ratesActions.fetchCoinsRates()
  }, [dexActions, ratesActions])

  const { step } = formValues
  const [scene, setScene] = useState<DexScenes>(
    localStorage.getItem(DEX_INTRO_VIEWED_KEY) ? DexScenes.SWAP : DexScenes.ONBOARDING
  )

  const onFinishOnboarding = () => {
    localStorage.setItem(DEX_INTRO_VIEWED_KEY, 'true')
    setScene(DexScenes.SWAP)
  }

  switch (scene) {
    case DexScenes.ONBOARDING:
      return (
        <PageWrapper>
          <Onboarding onClickStart={onFinishOnboarding} />
        </PageWrapper>
      )

    case DexScenes.SWAP:
      switch (step) {
        case DexSwapSteps.ENTER_DETAILS:
          return (
            <PageWrapper>
              <FormWrapper>
                <EnterSwapDetails />
              </FormWrapper>
            </PageWrapper>
          )

        case DexSwapSteps.CONFIRM_SWAP:
          return (
            <PageWrapper>
              <FormWrapper>
                <ConfirmSwap />
              </FormWrapper>
            </PageWrapper>
          )

        default:
          return notReachable(step)
      }

    default:
      return notReachable(scene)
  }
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dexActions: bindActionCreators(actions.components.dex, dispatch),
  ratesActions: bindActionCreators(actions.core.data.coins, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<React.ComponentType>(
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
    form: DEX_SWAP_FORM,
    initialValues: { step: DexSwapSteps.ENTER_DETAILS }
  }),
  connector
)

type Props = ConnectedProps<typeof connector>

export default enhance(Dex)
