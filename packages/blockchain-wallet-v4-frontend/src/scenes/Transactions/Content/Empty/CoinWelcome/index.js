import React from 'react'
import { path } from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { actions, selectors } from 'data'
import { coinProps } from './model'
import Welcome from './template'
import Airdrop from './template.airdrop'

class CoinWelcomeContainer extends React.PureComponent {
  render () {
    const { coin, canBuyBtc, canAirdrop, domainsR } = this.props
    const domains = domainsR.getOrElse({ comRoot: 'https://blockchain.com' })
    const partnerBtc = canBuyBtc.cata({
      Success: val => coin === 'BTC' && val,
      Loading: () => false,
      Failure: () => false,
      NotAsked: () => false
    })
    const airdrop = canAirdrop.cata({
      Success: val =>
        path([coin, 'airdrop'], coinProps) &&
        !path(['tags', path([coin, 'airdrop', 'name'], coinProps)], val),
      Loading: () => false,
      Failure: () => false,
      NotAsked: () => false
    })

    return airdrop ? (
      <Airdrop coin={coin} domains={domains} />
    ) : (
      <Welcome
        coin={coin}
        domains={domains}
        partner={partnerBtc}
        handleRequest={() =>
          this.props.modalActions.showModal(coinProps[coin].request)
        }
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  canBuyBtc: selectors.exchange.getCanTrade(state, 'Buy'),
  canAirdrop: selectors.modules.profile.getUserData(state),
  domainsR: selectors.core.walletOptions.getDomains(state)
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
