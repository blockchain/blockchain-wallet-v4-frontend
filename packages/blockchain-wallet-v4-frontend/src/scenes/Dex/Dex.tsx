import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { reduxForm } from 'redux-form'

import { actions, model, selectors } from 'data'
import { DexSwapForm, DexSwapSteps } from 'data/components/dex/types'
import { RootState } from 'data/rootReducer'

import { FormWrapper, PageWrapper } from './Dex.model'
// import Intro from './Intro'
import { Onboarding } from './Onboarding'
import ConfirmSwap from './Swap/ConfirmSwap'
import EnterSwapDetails from './Swap/EnterSwapDetails'

const { DEX_INTRO_VIEWED_KEY, DEX_SWAP_FORM } = model.components.dex

const Dex = ({ dexActions, formValues, ratesActions }: Props) => {
  useEffect(() => {
    dexActions.fetchChains()
    ratesActions.fetchCoinsRates()
  }, [dexActions, ratesActions])

  const wasIntroViewed = !!localStorage.getItem(DEX_INTRO_VIEWED_KEY)
  const { step } = formValues

  return (
    <PageWrapper>
      {/* {!wasIntroViewed && <Intro />} */}
      {!wasIntroViewed && <Onboarding />}
      {wasIntroViewed && (
        <FormWrapper>
          {step === DexSwapSteps.ENTER_DETAILS && <EnterSwapDetails />}
          {step === DexSwapSteps.CONFIRM_SWAP && <ConfirmSwap />}
        </FormWrapper>
      )}
    </PageWrapper>
  )
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
