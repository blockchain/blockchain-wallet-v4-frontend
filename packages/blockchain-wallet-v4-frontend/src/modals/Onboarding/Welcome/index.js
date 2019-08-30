import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import React, { PureComponent } from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'

import Welcome from './template'

class WelcomeContainer extends PureComponent {
  takeTour = () => {
    this.props.close()
    this.props.onboardingActions.setWalletTourVisibility(true)
  }

  render () {
    return <Welcome takeTour={this.takeTour} {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  onboardingActions: bindActionCreators(actions.components.onboarding, dispatch)
})

const enhance = compose(
  modalEnhancer('Welcome'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(WelcomeContainer)
