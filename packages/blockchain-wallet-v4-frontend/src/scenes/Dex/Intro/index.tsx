import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions, model } from 'data'
import { DexSwapSteps } from 'data/components/dex/types'

import Intro from './Intro.template'

const { DEX_INTRO_VIEWED_KEY, DEX_SWAP_FORM } = model.components.dex

const DexIntroContainer = ({ formActions }: Props) => {
  const [step, setStep] = useState(0)

  const handleStart = () => {
    localStorage.setItem(DEX_INTRO_VIEWED_KEY, 'true')
    formActions.change(DEX_SWAP_FORM, 'step', DexSwapSteps.ENTER_DETAILS)
  }

  return <Intro setStep={setStep} handleStart={handleStart} step={step} />
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(DexIntroContainer)
