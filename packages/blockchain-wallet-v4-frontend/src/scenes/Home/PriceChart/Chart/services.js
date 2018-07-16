import { Color } from 'blockchain-info-components'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

export const getConfig = (start, interval, currency, data) => ({
  chart: {
    height: 230
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
        return (currency + Currency.formatFiat(this.value))
      },
      style: {
        color: Color('black')
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
        color: Color('black')
      }
    }
  },
  plotOptions: {
    series: {
      color: Color('brand-secondary'),
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
    pointFormatter: function () {
      return currency + Currency.formatFiat(this.y)
    }
  },
  credits: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  series: [{
    name: 'Price',
    data: data
  }]
})
