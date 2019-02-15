import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { calculateStart, calculateInterval } from 'services/ChartService'
import { getConfig } from './services'

const Wrapper = styled.div`
  width: 100%;
  svg {
    font-family: 'Montserrat', Helvetica, sans-serif !important;
    .highcharts-background {
      fill: ${props => props.theme['white']} !important;
    }
    .highcharts-axis-labels {
      text {
        font-size: 11px;
        fill: ${props => props.theme['gray-5']} !important;
      }
    }
    .highcharts-tooltip {
      text {
        font-size: 12px;
        fill: ${props => props.theme['gray-5']} !important;
      }
    }
    .highcharts-series {
      path:first-child {
        font-size: 12px;
        stroke: ${props => props.theme['brand-secondary']} !important;
      }
    }
  }
`

class Chart extends React.PureComponent {
  constructor (props) {
    super(props)
    const { coin, time, data, currency } = this.props
    const decimals = coin === 'XLM' ? 4 : 2
    const start = calculateStart(coin, time)
    const interval = calculateInterval(coin, time)
    const config = getConfig(start, interval, currency, data, decimals)
    this.state = { start, interval, config }
  }

  render () {
    return (
      <Wrapper>
        <ReactHighcharts config={this.state.config} isPureConfig />
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
