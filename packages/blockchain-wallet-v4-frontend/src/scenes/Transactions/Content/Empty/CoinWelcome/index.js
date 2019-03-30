import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { actions, model } from 'data'
import {
  getAvailability,
  getCanBuyBtc,
  getCanAirdrop,
  getDomains
} from './selectors'
import Welcome from './template'
import WelcomeAirdrop from './template.airdrop'

const { COIN_MODELS } = model.coins

class CoinWelcomeContainer extends React.PureComponent {
  render () {
    const {
      availability,
      coin,
      canAirdrop,
      domains,
      partner,
      ...rest
    } = this.props
    const { modalActions, onboardingActions } = rest
    const currentCoin = COIN_MODELS[coin]

    return canAirdrop ? (
      <WelcomeAirdrop
        currentCoin={currentCoin}
        domains={domains}
        onboardingActions={onboardingActions}
      />
    ) : (
      <Welcome
        availability={availability}
        currentCoin={currentCoin}
        partner={partner}
        handleRequest={() => modalActions.showModal(COIN_MODELS[coin].request)}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  canAirdrop: getCanAirdrop(state, ownProps),
  partner: getCanBuyBtc(state, ownProps),
  domains: getDomains(state),
  availability: getAvailability(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  onboardingActions: bindActionCreators(actions.components.onboarding, dispatch)
})

CoinWelcomeContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinWelcomeContainer)
