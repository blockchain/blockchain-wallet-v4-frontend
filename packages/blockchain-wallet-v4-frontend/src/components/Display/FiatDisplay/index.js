import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatDisplayContainer extends React.PureComponent {
  componentWillMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      switch (this.props.coin) {
        case 'BTC':
          return this.props.btcActions.fetchRates()
        case 'ETH':
          return this.props.ethActions.fetchRates()
        case 'BCH':
          return this.props.bchActions.fetchRates()
        case 'XLM':
          return this.props.xlmActions.fetchRates()
      }
    }
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: value => <Success {...rest}>{value}</Success>,
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

FiatDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH', 'XLM']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin, ownProps.children)
})

const mapDispatchToProps = dispatch => ({
  btcActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  ethActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiatDisplayContainer)
