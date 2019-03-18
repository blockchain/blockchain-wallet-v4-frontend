import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { calculateStart, calculateInterval } from 'services/ChartService'
import { getConfig, renderMinMax } from './services'

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  * {
    font-family: 'Montserrat', Helvetica, sans-serif !important;
  }
  svg {
    .highcharts-background {
      fill: ${props => props.theme['white']} !important;
    }
  }
  .highcharts-container,
  .highcharts-root {
    overflow: visible !important;
  }
  .highcharts-tooltip span {
    padding: 0px 2px 2px 2px;
    > span:first-child {
      font-weight: 300;
    }
  }
  .min-max {
    padding: 4px 6px;
    border-radius: 4px;
    color: ${props => props.theme['white']};
    background: ${props => props.theme[props.coin.toLowerCase()]};
  }
`

class Chart extends React.PureComponent {
  constructor (props) {
    super(props)
    const { coin, time, data, currency } = this.props
    const decimals = coin === 'XLM' ? 4 : 2
    const start = calculateStart(coin, time)
    const interval = calculateInterval(coin, time)
    const config = getConfig(start, interval, coin, currency, data, decimals)
    this.state = { config, start, interval, decimals }
  }

  handleCallback = chart => {
    const { currency, data } = this.props
    const { decimals } = this.state

    renderMinMax(chart, { currency, data, decimals })
  }

  render () {
    return (
      <Wrapper coin={this.props.coin}>
        <ReactHighcharts
          config={this.state.config}
          callback={this.handleCallback}
          isPureConfig
        />
      </Wrapper>
    )
  }
}

Chart.propTypes = {
  currency: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

export default Chart
