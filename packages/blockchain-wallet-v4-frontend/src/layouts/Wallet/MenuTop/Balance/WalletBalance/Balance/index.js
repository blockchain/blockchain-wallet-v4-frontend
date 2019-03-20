import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

class Balance extends React.PureComponent {
  componentDidMount () {
    this.handleRefresh()
  }

  handleRefresh = () => {
    switch (this.props.coin) {
      case 'BTC':
        this.props.btcActions.fetchData()
        break
      case 'BCH':
        this.props.bchActions.fetchData()
        break
      case 'BSV':
        this.props.bsvActions.fetchData()
        break
      case 'ETH':
        this.props.ethActions.fetchData()
        break
      case 'XLM':
        this.props.xlmActions.fetchData()
        break
      default:
        // fallback to erc20
        this.props.ethActions.fetchErc20Data(this.props.coin)
    }
  }

  render () {
    const { coin, data, large } = this.props

    return data.cata({
      Success: value => <Success balance={value} large={large} coin={coin} />,
      Failure: () => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance large={large} coin={coin} />,
      NotAsked: () => <LoadingBalance large={large} coin={coin} />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  bsvActions: bindActionCreators(actions.core.data.bsv, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance)
