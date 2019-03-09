import { Color } from 'blockchain-info-components'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import ReactHighcharts from 'react-highcharts'

export const getConfig = (start, interval, coin, currency, data, decimals) => ({
  chart: {
    height: 340,
    type: 'area',
    spacing: [0, 0, 0, 0],
    data: {
      dateFormat: 'YYYY/mm/dd'
    }
  },
  title: {
    text: null
  },
  yAxis: {
    visible: false,
    minPadding: 0,
    maxPadding: 0,
    gridLineColor: 'transparent'
  },
  xAxis: {
    visible: false,
    minPadding: 0,
    maxPadding: 0,
    type: 'datetime',
    gridLineColor: 'transparent'
  },
  plotOptions: {
    series: {
      pointStart: start,
      pointInterval: interval,
      animation: false
    },
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [
            0,
            ReactHighcharts.Highcharts.Color(Color(coin.toLowerCase()))
              .setOpacity(0.7)
              .get('rgba')
          ],
          [
            1,
            ReactHighcharts.Highcharts.Color(Color(coin.toLowerCase()))
              .setOpacity(0.1)
              .get('rgba')
          ]
        ]
      },
      marker: {
        radius: 0
      },
      lineWidth: 2,
      color: Color(coin.toLowerCase()),
      states: {
        hover: {
          lineWidth: 2
        }
      },
      threshold: null,
      dataGrouping: { enabled: false }
    },
    line: {
      marker: {
        enabled: false
      }
    }
  },
  tooltip: {
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 4,
    valueDecimals: 2,
    backgroundColor: Color(coin.toLowerCase()),
    shadow: false,
    padding: 4,
    style: {
      color: Color('white')
    },
    xDateFormat: '%b %d, %Y',
    useHTML: true,
    pointFormatter: function () {
      return currency + Currency.formatFiat(this.y, decimals)
    }
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
})
