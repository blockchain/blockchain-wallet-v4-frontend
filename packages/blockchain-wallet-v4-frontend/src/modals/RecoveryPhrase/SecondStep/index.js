import React from 'react'
import ui from 'redux-ui'

import SecondStep from './template.js'

const SecondStepContainer = props => {
  const { ui, updateUI, mnemonic } = props

  const handleClickPrevious = () => {
    updateUI({ index: ui.index - 1 })
  }

  const handleClickNext = () => {
    updateUI({ index: ui.index + 1 })
  }

  return (
    <SecondStep
      {...props}
      index={ui.index}
      word={mnemonic[ui.index]}
      handleClickPrevious={handleClickPrevious}
      handleClickNext={handleClickNext}
    />
  )
}

export default ui({ key: 'RecoveryPhraseMnemonic', state: { index: 0 } })(
  SecondStepContainer
)
