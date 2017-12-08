import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import { configure, INTERVALS, SCALES, BTCSTART, ETHSTART } from './chart.config.js'
import Chart from './template.js'

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state =
    {
      coin: 'BTC',
      timeframe: 'all',
      start: BTCSTART,
      interval: INTERVALS.day,
      scale: SCALES.FIVEDAY
    }
    this.selectBitcoin = this.selectBitcoin.bind(this)
    this.selectEthereum = this.selectEthereum.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
  }

  componentWillMount () {
    const { currency } = this.props
    const { coin, start, scale } = this.state
    this.props.actions.initChart(coin, currency, start, scale)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !equals(this.props.chart, nextProps.chart) ||
           !equals(this.state.coin, nextState.coin) ||
           !equals(this.state.timeframe, nextState.timeframe)
  }

  componentWillUpdate (nextProps, nextState) {
    if (!equals(this.state.coin, nextState.coin) || !equals(this.state.timeframe, nextState.timeframe)) {
      this.props.actions.initChart(nextState.coin, nextProps.currency, nextState.start, nextState.scale)
    }
  }

  selectBitcoin () {
    this.setState({ coin: 'BTC', start: BTCSTART })
  }

  selectEthereum () {
    this.setState({ coin: 'ETH', start: ETHSTART })
  }

  selectTimeframe (timeframe) {
    switch (timeframe) {
      case 'all':
        this.setState({
          start: this.state.coin === 'BTC' ? BTCSTART : ETHSTART,
          scale: SCALES.FIVEDAY,
          timeframe,
          interval: INTERVALS.day
        })
        break
      case 'year':
        this.setState({
          start: moment().subtract(1, 'year').format('X'),
          scale: SCALES.DAY,
          timeframe,
          interval: INTERVALS.day
        })
        break
      case 'month':
        this.setState({
          start: moment().subtract(1, 'month').format('X'),
          scale: SCALES.TWOHOUR,
          timeframe,
          interval: INTERVALS.day
        })
        break
      case 'week':
        this.setState({
          start: moment().subtract(7, 'day').format('X'),
          scale: SCALES.HOUR,
          timeframe,
          interval: INTERVALS.hour
        })
        break
      case 'day':
        this.setState({
          start: moment().subtract(1, 'day').format('X'),
          scale: SCALES.FIFTEENMIN,
          timeframe,
          interval: INTERVALS.hour
        })
        break
      default: break
    }
  }

  render () {
    const { coin, timeframe, start, interval } = this.state
    const { currency, chart } = this.props
    const data = chart.data.map(o => [o.timestamp * 1000, o.price])
    const config = configure(start, interval, currency, data)

    return <Chart
      coin={coin}
      timeframe={timeframe}
      config={config}
      selectBitcoin={this.selectBitcoin}
      selectEthereum={this.selectEthereum}
      selectTimeframe={this.selectTimeframe}
    />
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  chart: selectors.components.chart.getChart(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.chart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)
