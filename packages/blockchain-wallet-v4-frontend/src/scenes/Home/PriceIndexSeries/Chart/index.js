import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { selectPriceIndexSeriesOptions } from 'services/ChartService'
import configure from './chart.config.js'
import { RemoteData } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class Chart extends React.Component {
  componentWillMount () {
    const { coin, currency, timeframe } = this.props
    const { start, scale } = selectPriceIndexSeriesOptions(coin, timeframe)
    this.props.dataMiscActions.fetchPriceIndexSeries(coin, currency, start, scale)
  }

  componentWillReceiveProps (nextProps) {
    const { coin, currency, timeframe } = this.props
    if (!equals(coin, nextProps.coin) || !equals(timeframe, nextProps.timeframe)) {
      const { start, scale } = selectPriceIndexSeriesOptions(nextProps.coin, nextProps.timeframe)
      this.props.dataMiscActions.fetchPriceIndexSeries(nextProps.coin, currency, start, scale)
    }
  }

  shouldComponentUpdate (nextProps) {
    return !equals(this.props.coin, nextProps.coins) || !equals(this.props.timeframe, nextProps.timeframe)
  }

  render () {
    console.log(this.props.timeframe)
    const { currency, data, coin, timeframe } = this.props
    const { start, interval } = selectPriceIndexSeriesOptions(coin, timeframe)

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success
        coin={coin}
        timeframe={timeframe}
        config={configure(start, interval, currency, value)}
        selectCoin={this.selectCoin}
        selectTimeframe={this.selectTimeframe}
      />,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
    })
  }
}

Chart.propTypes = {
  currency: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  timeframe: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataMiscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Chart)
