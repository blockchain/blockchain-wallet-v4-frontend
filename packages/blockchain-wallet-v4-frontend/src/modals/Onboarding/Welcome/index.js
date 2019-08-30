import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import React, { PureComponent } from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'

import Welcome from './template'

class WelcomeContainer extends PureComponent {
  render () {
    const {
      skipWalletTourClicked,
      takeWalletTourClicked
    } = this.props.onboardingActions
    return (
      <Welcome
        onSkipTour={() => skipWalletTourClicked(takeWalletTourClicked)}
        onTakeTour={() => takeWalletTourClicked()}
        {...this.props}
      />
    )
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
