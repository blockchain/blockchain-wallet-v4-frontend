import React from 'react'
import ui from 'redux-ui'
import SecondStep from './template.js'
import { compose, values, pickAll } from 'ramda'

const SecondStepContainer = props => {
  const { ui, updateUI } = props
  const handleClickPrevious = () => { updateUI({ step: ui.step - 1 }) }
  const handleClickNext = () => { updateUI({ step: ui.step + 1 }) }

  const getWordsAtStep = (step) => {
    const pickIndexes = compose(values, pickAll)
    switch (step) {
      case 1: return pickIndexes([0, 1, 2, 3], props.recoveryPhrase)
      case 2: return pickIndexes([4, 5, 6, 7], props.recoveryPhrase)
      case 3: return pickIndexes([8, 9, 10, 11], props.recoveryPhrase)
    }
  }

  return (
    <SecondStep
      {...props}
      step={ui.step}
      words={getWordsAtStep(ui.step)}
      handleClickPrevious={handleClickPrevious}
      handleClickNext={handleClickNext}
    />
  )
}

export default ui({ key: 'RecoveryPhraseMnemonic', state: { step: 1 } })(SecondStepContainer)
