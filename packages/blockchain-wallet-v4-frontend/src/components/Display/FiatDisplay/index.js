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
  componentDidMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      switch (this.props.coin) {
        case 'BCH':
          return this.props.bchActions.fetchRates()
        case 'BTC':
          return this.props.btcActions.fetchRates()
        case 'BSV':
          return this.props.bsvActions.fetchRates()
        case 'ETH':
          return this.props.ethActions.fetchRates()
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
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH', 'BSV', 'XLM']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin, ownProps.children)
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  bsvActions: bindActionCreators(actions.core.data.bsv, dispatch),
  ethActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiatDisplayContainer)
