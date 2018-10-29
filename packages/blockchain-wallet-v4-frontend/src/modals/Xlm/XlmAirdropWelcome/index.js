import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import AirdropWelcome from './template.js'

class AirdropWelcomeContainer extends React.PureComponent {
  render () {
    return <AirdropWelcome {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

const enhance = compose(
  modalEnhancer('AirdropWelcome'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(AirdropWelcomeContainer)
