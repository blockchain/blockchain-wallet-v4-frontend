import React from 'react'
import { compose } from 'redux'

import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepCivic from './template.js'

class TwoStepCivicContainer extends React.Component {
  render () {
    return <TwoStepCivic />
  }
}

const enhance = compose(
  modalEnhancer('TwoStepCivic')
)

export default enhance(TwoStepCivicContainer)
