import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import ReactHighstock from 'react-highcharts/reactHighstock'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: space-between;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};

  & > * { padding: 10px 0; }
`

const TickerText = styled(Text)`
  cursor: pointer;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  color: white;
`

const Chart = (props) => {
  const { currency, data, btcCoin, btcRate, ethCoin, ethRate } = props

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
        color: '#10ADE4'
      },
      line: {
        marker: {
          enabled: false
        }
      }
    },
    tooltip: {
      pointFormat: '{series.name}(' + 'GBP' + '): {point.y}'
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

  return (
    <Wrapper>
      <Row>
        <TickerText onClick={() => console.log('BTC')} size='24px' weight={300} color='brand-primary'>
          {`${btcCoin} = ${btcRate}`}
        </TickerText>
        <TickerText onClick={() => console.log('ETH')} size='24px' weight={300} color='brand-primary'>
          {`${ethCoin} = ${ethRate}`}
        </TickerText>
      </Row>
      <ReactHighcharts config={config} />
    </Wrapper>
  )
}

export default Chart
