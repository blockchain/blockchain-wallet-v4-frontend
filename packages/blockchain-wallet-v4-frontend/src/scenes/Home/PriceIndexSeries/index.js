import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class PriceIndexSeries extends React.Component {
  constructor (props) {
    super(props)
    this.state = { coin: 'BTC', timeframe: 'month' }
    this.selectCoin = this.selectCoin.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
  }

  selectCoin (value) {
    this.setState({ coin: value })
  }

  selectTimeframe (value) {
    this.setState({ timeframe: value })
  }

  render () {
    const { data } = this.props
    const { coin, timeframe } = this.state

    return data.cata({
      Success: (value) => <Success currency={value.currency} coin={coin} timeframe={timeframe} selectCoin={this.selectCoin} selectTimeframe={this.selectTimeframe} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
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
