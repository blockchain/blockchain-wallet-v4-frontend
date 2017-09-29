import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'

import ChartTicker from './ChartTicker'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: space-between;
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  color: white;
`

const TickerWrapper = styled.div`
  padding-right: 10px;
`

const TimeWindow = styled(Link)`
  color: ${props => props.theme['brand-primary']};
  text-decoration: underline;
`

const Chart = (props) => {
  const { currency, data, selectCoin, selectedCoin, start, selectTimeframe, interval } = props

  const config = {
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
        pointStart: start,
        pointInterval: interval
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

  const btcCoin = `BTC`
  const ethCoin = `ETH`

  return (
    <Wrapper>
      <Row>
        <TickerWrapper onClick={() => selectCoin(btcCoin)}>
          <ChartTicker coin={btcCoin} selectedCoin={selectedCoin} />
        </TickerWrapper>
        <TickerWrapper onClick={() => selectCoin(ethCoin)} >
          <ChartTicker coin={ethCoin} selectedCoin={selectedCoin} />
        </TickerWrapper>
      </Row>
      <ReactHighcharts config={config} />
      <Row>
        <TimeWindow onClick={() => selectTimeframe('all')}>
          <FormattedMessage id='scenes.home.chart.alltime' defaultMessage='All time' />
        </TimeWindow>
        <TimeWindow onClick={() => selectTimeframe('year')} >
          <FormattedMessage id='scenes.home.chart.year' defaultMessage='Year' />
        </TimeWindow>
        <TimeWindow onClick={() => selectTimeframe('month')} >
          <FormattedMessage id='scenes.home.chart.month' defaultMessage='Month' />
        </TimeWindow>
        <TimeWindow onClick={() => selectTimeframe('week')} >
          <FormattedMessage id='scenes.home.chart.week' defaultMessage='Week' />
        </TimeWindow>
        <TimeWindow onClick={() => selectTimeframe('day')} >
          <FormattedMessage id='scenes.home.chart.day' defaultMessage='Day' />
        </TimeWindow>
      </Row>
    </Wrapper>
  )
}

export default Chart
