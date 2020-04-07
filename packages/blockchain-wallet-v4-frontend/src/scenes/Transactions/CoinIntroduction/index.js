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

class CoinIntroductionContainer extends React.PureComponent {
  render () {
    const {
      availability,
      coin,
      modalActions,
      partner,
      supportedCoins,
      simpleBuyActions
    } = this.props
    const currentCoin = supportedCoins[coin]
    return (
      <Welcome
        availability={availability}
        currentCoin={currentCoin}
        partner={partner}
        handleRequest={() =>
          modalActions.showModal('@MODAL.REQUEST.' + currentCoin.coinCode)
        }
        handleBuy={() => simpleBuyActions.showModal('emptyFeed', coin)}
      />
    )
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
  onboardingActions: bindActionCreators(
    actions.components.onboarding,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

CoinIntroductionContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinIntroductionContainer)
