import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RemoteData } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getFiatDisplay } from './selectors'
import FiatDisplay from './template'
import Error from './template.error'
import Loading from './template.loading'

class FiatDisplayContainer extends React.Component {
  componentWillMount () {
    switch (this.props.coin) {
      case 'BTC': return this.props.bitcoinActions.fetchRates()
      case 'ETH': return this.props.ethereumActions.fetchRates()
    }
    this.props.settingsActions.fetchSettings()
  }

  render () {
    const { fiatDisplay, ...rest } = this.props
    console.log('fiatDisplay', fiatDisplay)

    return RemoteData.caseOf(fiatDisplay.value, {
      Success: (value) => <FiatDisplay {...rest}>{value}</FiatDisplay>,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
    })
  }
}

FiatDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  fiatDisplay: getFiatDisplay(state, ownProps.coin, ownProps.children)
})

const mapDispatchToProps = dispatch => ({
  bitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FiatDisplayContainer)
