import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import Form from 'components/Form/Form'
import { actions, model, selectors } from 'data'
import { DexSwapForm, DexSwapSteps } from 'data/components/dex/types'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

import Intro from './Intro'
import ConfirmSwap from './Swap/ConfirmSwap'
import EnterSwapDetails from './Swap/EnterSwapDetails'

const { DEX_INTRO_VIEWED_KEY, DEX_SWAP_FORM } = model.components.dex

const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const FormWrapper = styled(Form)`
  box-sizing: border-box;
  width: 550px;
  margin-top: 72px;
  background-color: ${(props) => props.theme.white};
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.grey100};

  ${media.tablet`
    width: 100%;
  `}
  ${media.mobile`
    padding: 20px;
  `}
`

const Dex = ({ dexActions, formValues, ratesActions }: Props) => {
  useEffect(() => {
    dexActions.fetchChains()
    ratesActions.fetchCoinsRates()
  }, [dexActions, ratesActions])

  const wasIntroViewed = !!localStorage.getItem(DEX_INTRO_VIEWED_KEY)
  const { step } = formValues

  return (
    <PageWrapper>
      <FormWrapper>
        {!wasIntroViewed && <Intro />}
        {wasIntroViewed && step === DexSwapSteps.ENTER_DETAILS && <EnterSwapDetails />}
        {wasIntroViewed && step === DexSwapSteps.CONFIRM_SWAP && <ConfirmSwap />}
      </FormWrapper>
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
