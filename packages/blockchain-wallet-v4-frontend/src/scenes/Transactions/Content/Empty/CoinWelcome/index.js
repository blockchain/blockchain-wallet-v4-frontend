import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { coinProps } from './model'
import { actions } from 'data'
import { getCanBuyBtc, getCanAirdrop, getDomains } from './selectors'
import Welcome from './template'
import Airdrop from './template.airdrop'

class CoinWelcomeContainer extends React.PureComponent {
  render () {
    const { coin, canAirdrop, domains, partner } = this.props

    return canAirdrop ? (
      <Airdrop coin={coin} domains={domains} />
    ) : (
      <Welcome
        coin={coin}
        domains={domains}
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
  domains: getDomains(state)
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
