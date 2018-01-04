import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RemoteData } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatDisplayContainer extends React.Component {
  componentWillMount () {
    this.props.settingsActions.fetchSettings()
    switch (this.props.coin) {
      case 'BTC': return this.props.bitcoinActions.fetchRates()
      case 'ETH': return this.props.ethereumActions.fetchRates()
    }
  }

  render () {
    const { data, ...rest } = this.props

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success {...rest}>{value}</Success>,
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
  data: getData(state, ownProps.coin, ownProps.children)
})

const mapDispatchToProps = dispatch => ({
  bitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FiatDisplayContainer)
