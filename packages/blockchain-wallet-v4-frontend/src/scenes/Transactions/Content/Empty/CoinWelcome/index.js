import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { actions, selectors } from 'data'
import { coinProps } from './model'
import Welcome from './template'

class CoinWelcomeContainer extends React.PureComponent {
  render () {
    const { coin, canBuyBtc } = this.props
    const partnerBtc = canBuyBtc.cata({
      Success: val => coin === 'BTC' && val,
      Loading: () => false,
      Failure: () => false,
      NotAsked: () => false
    })

    return (
      <Welcome
        coin={coin}
        partner={partnerBtc}
        handleRequest={() =>
          this.props.modalActions.showModal(coinProps[coin].request)
        }
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  canBuyBtc: selectors.exchange.getCanTrade(state, 'Buy')
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
