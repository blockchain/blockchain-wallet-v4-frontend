import React from 'react'
import { compose } from 'redux'

import modalEnhancer from 'providers/ModalEnhancer'
import Welcome from './template.js'

class WelcomeContainer extends React.PureComponent {
  render () {
    return (
      <Welcome {...this.props} />
    )
  }
}

const enhance = compose(
  modalEnhancer('Welcome')
)

export default enhance(WelcomeContainer)
