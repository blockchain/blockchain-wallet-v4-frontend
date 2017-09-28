import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { equals } from 'ramda'
import { actions, selectors } from 'data'
import Chart from './template.js'

const intervals = {
  hour: 3600 * 1000,
  day: 24 * 3600 * 1000
}

const scales = {
  FIFTEENMIN: 900,
  HOUR: 3600,
  TWOHOUR: 7200,
  DAY: 86400,
  FIVEDAY: 432000
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
    this.configureChart = this.configureChart.bind(this)
  }

  componentWillMount () {
    const { coin, currency, start, scale } = this.state
    this.props.chartActions.fetchPriceIndexSeries(coin, currency, start, scale)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !equals(this.props.data, nextProps.data) ||
           !equals(this.state.coin, nextState.coin) ||
           !equals(this.state.timeframe, nextState.timeframe)
  }

  componentWillUpdate (nextProps, nextState) {
    if (!equals(this.state.coin, nextState.coin) || !equals(this.state.timeframe, nextState.timeframe)) {
      this.props.chartActions.fetchPriceIndexSeries(nextState.coin, nextProps.currency, nextState.start, nextState.scale)
    }
  }

  selectBitcoin () {
    this.setState({ coin: 'BTC' })
  }

  selectEthereum () {
    this.setState({ coin: 'ETH' })
  }

  selectTimeframe (timeframe) {
    const date = new Date()

    switch (timeframe) {
      case 'all':
        this.setState({ start: this.state.coin === 'BTC' ? BTCSTART : ETHSTART, scale: scales.FIVEDAY })
        break
      case 'year':
        this.setState({ start: Math.round(date.setFullYear(date.getFullYear() - 1) / 1000 | 0), scale: scales.DAY })
        break
      case 'month':
        this.setState({ start: Math.round(date.setMonth(date.getMonth() - 1) / 1000 | 0), scale: scales.TWOHOUR })
        break
      case 'week':
        this.setState({ start: Math.round(date.setDate(date.getDate() - 7) / 1000 | 0), scale: scales.HOUR, interval: intervals.hour })
        break
      case 'day':
        this.setState({ start: Math.round(date.setDate(date.getDate() - 1) / 1000 | 0), scale: scales.FIFTEENMIN, interval: intervals.hour })
        break
      default: break
    }
    this.setState({ timeframe })
  }

  configureChart () {
    const { currency, data } = this.props

    return {
      chart: {
        height: 300
      },
      title: {
        text: null
      },
      yAxis: {
        title: {
          text: null
        },
        labels: {
          formatter: function () {
            return (currency + this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
          }
        },
        lineWidth: 1,
        gridLineWidth: 0
      },
      xAxis: {
        type: 'datetime',
        tickWidth: 0,
        labels: {
          style: {
            color: 'gray'
          }
        }
      },
      plotOptions: {
        series: {
          color: '#10ADE4',
          pointStart: this.state.start,
          pointInterval: this.state.interval
        },
        line: {
          marker: {
            enabled: false
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name}(' + currency + '): {point.y}'
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      series: [
        {
          name: 'Price',
          data: data
        }
      ]
    }
  }

  render () {
    const config = this.configureChart()

    return (
      <Chart
        coin={this.state.coin}
        timeframe={this.state.timeframe}
        config={config}
        selectBitcoin={this.selectBitcoin}
        selectEthereum={this.selectEthereum}
        selectTimeframe={this.selectTimeframe} />
    )
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state),
  data: selectors.charts.getPriceIndexSeries(state).map(o => [o.timestamp * 1000, o.price])
})

const mapDispatchToProps = (dispatch) => ({
  chartActions: bindActionCreators(actions.charts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)
