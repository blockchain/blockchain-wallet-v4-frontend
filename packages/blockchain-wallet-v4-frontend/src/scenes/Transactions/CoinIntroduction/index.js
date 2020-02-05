import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'

import { actions, selectors } from 'data'

import {
  currentUserTier,
  getAvailability,
  getCanBuyBtc,
  getCurrentKYCState,
  getDomains,
  getTags
} from './selectors'
import Welcome from './template'
import WelcomePax from './template.pax'
import WelcomeStx from './template.stx'

class CoinIntroductionContainer extends React.PureComponent {
  render () {
    const {
      availability,
      coin,
      currentUserTier,
      domains,
      handleRequest,
      modalActions,
      partner,
      supportedCoins,
      ...rest
    } = this.props
    const currentCoin = supportedCoins[coin]

    switch (currentCoin.coinCode) {
      case 'STX': {
        return <WelcomeStx currentCoin={currentCoin} {...rest} />
      }
      case 'PAX': {
        return (
          <WelcomePax
            availability={availability}
            currentCoin={currentCoin}
            currentUserTier={currentUserTier}
          />
        )
      }
      default: {
        return (
          <Welcome
            availability={availability}
            currentCoin={currentCoin}
            partner={partner}
            handleRequest={() =>
              modalActions.showModal('@MODAL.REQUEST.' + currentCoin.coinCode)
            }
          />
        )
      }
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  partner: getCanBuyBtc(state, ownProps),
  domains: getDomains(state),
  availability: getAvailability(state, ownProps),
  currentUserTier: currentUserTier(state),
  currentTags: getTags(state),
  currentKYCState: getCurrentKYCState(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  onboardingActions: bindActionCreators(actions.components.onboarding, dispatch)
})

CoinIntroductionContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinIntroductionContainer)
