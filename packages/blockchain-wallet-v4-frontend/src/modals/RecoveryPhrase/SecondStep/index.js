import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import ui from 'redux-ui'

import { selectors } from 'data'
import SecondStep from './template.js'

const SecondStepContainer = props => {
  const { ui, updateUI, mnemonic } = props

  const handleClickPrevious = () => { updateUI({ index: ui.index - 1 }) }

  const handleClickNext = () => { updateUI({ index: ui.index + 1 }) }

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

const mapStateToProps = (state, ownProps) => {
  console.log(state)
  return {
    mnemonic: selectors.core.wallet.getMnemonic(state).split(' ')
  }
}

const enhance = compose(
  ui({ key: 'RecoveryPhraseMnemonic', state: { index: 0 } }),
  connect(mapStateToProps)
)

export default enhance(SecondStepContainer)
