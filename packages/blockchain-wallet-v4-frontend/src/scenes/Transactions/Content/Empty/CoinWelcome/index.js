import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { coinProps } from './model'
import { actions } from 'data'
import {
  getAvailability,
  getCanBuyBtc,
  getCanAirdrop,
  getDomains
} from './selectors'
import Welcome from './template'
import WelcomeAirdrop from './template.airdrop'

class CoinWelcomeContainer extends React.PureComponent {
  render () {
    const { availability, coin, canAirdrop, domains, partner } = this.props

    return canAirdrop ? (
      <WelcomeAirdrop coin={coin} domains={domains} />
    ) : (
      <Welcome
        availability={availability}
        coin={coin}
        partner={partner}
        handleRequest={() =>
          this.props.modalActions.showModal(coinProps[coin].request)
        }
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

CoinWelcomeContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH', 'XLM']).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinWelcomeContainer)
