import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import React, { PureComponent } from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'

import WalletTour from './template'

class WalletTourContainer extends PureComponent {
  render () {
    const {
      skipWalletTourClicked,
      takeWalletTourClicked
    } = this.props.onboardingActions
    return (
      <WalletTour
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
  modalEnhancer('WalletTour'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(WalletTourContainer)
