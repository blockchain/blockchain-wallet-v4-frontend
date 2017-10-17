import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import ChartConfig from './chart.config.js'
import Chart from './template.js'

const intervals = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000
}
const scales = {
  FIFTEENMIN: 15 * 60,
  HOUR: 60 * 60,
  TWOHOUR: 2 * 60 * 60,
  DAY: 24 * 60 * 60,
  FIVEDAY: 5 * 24 * 60 * 60
}
const BTCSTART = 1282089600
const ETHSTART = 1438992000

class ChartContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state =
    {
      coin: 'BTC',
      timeframe: 'all',
      start: BTCSTART,
      interval: intervals.day,
      scale: scales.FIVEDAY
    }
    this.selectBitcoin = this.selectBitcoin.bind(this)
    this.selectEthereum = this.selectEthereum.bind(this)
    this.selectTimeframe = this.selectTimeframe.bind(this)
  }

  componentWillMount () {
    const { currency } = this.props
    const { coin, start, scale } = this.state
    this.props.dataActions.getPriceIndexSeries(coin, currency, start, scale)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !equals(this.props.data, nextProps.data) ||
           !equals(this.state.coin, nextState.coin) ||
           !equals(this.state.timeframe, nextState.timeframe)
  }

  componentWillUpdate (nextProps, nextState) {
    if (!equals(this.state.coin, nextState.coin) || !equals(this.state.timeframe, nextState.timeframe)) {
      this.props.dataActions.getPriceIndexSeries(nextState.coin, nextProps.currency, nextState.start, nextState.scale)
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
          scale: scales.FIVEDAY,
          timeframe,
          interval: intervals.day
        })
        break
      case 'year':
        this.setState({
          start: moment().subtract(1, 'year').format('X'),
          scale: scales.DAY,
          timeframe,
          interval: intervals.day
        })
        break
      case 'month':
        this.setState({
          start: moment().subtract(1, 'month').format('X'),
          scale: scales.TWOHOUR,
          timeframe,
          interval: intervals.day
        })
        break
      case 'week':
        this.setState({
          start: moment().subtract(7, 'day').format('X'),
          scale: scales.HOUR,
          timeframe,
          interval: intervals.hour
        })
        break
      case 'day':
        this.setState({
          start: moment().subtract(1, 'day').format('X'),
          scale: scales.FIFTEENMIN,
          timeframe,
          interval: intervals.hour
        })
        break
      default: break
    }
  }

  render () {
    const { coin, timeframe, start, interval } = this.state
    const { currency, data } = this.props
    const config = ChartConfig(start, interval, currency, data)

    return (
      <Chart
        coin={coin}
        timeframe={timeframe}
        config={config}
        selectBitcoin={this.selectBitcoin}
        selectEthereum={this.selectEthereum}
        selectTimeframe={this.selectTimeframe} />
    )
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  data: selectors.core.charts.getPriceIndexSeries(state).map(o => [o.timestamp * 1000, o.price])
})

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)
