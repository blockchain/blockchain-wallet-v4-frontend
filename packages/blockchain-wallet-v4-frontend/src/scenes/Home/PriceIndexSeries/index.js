import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RemoteData } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class PriceIndexSeries extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coin: 'BTC', timeframe: 'all' }
    this.selectCoin = this.selectCoin.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
  }

  selectCoin (value) {
    this.setState({ coin: value })
  }

  selectTimeframe (value) {
    this.setState({ timeframe: value })
  }

  componentWillMount () {
    this.props.settingsActions.fetchSettings()
  }

  render () {
    const { data } = this.props
    const { coin, timeframe } = this.state

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success currency={value.currency} coin={coin} timeframe={timeframe} selectCoin={this.selectCoin} selectTimeframe={this.selectTimeframe} />,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceIndexSeries)
