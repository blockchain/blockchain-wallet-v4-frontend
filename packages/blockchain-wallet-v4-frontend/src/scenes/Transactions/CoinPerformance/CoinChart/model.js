import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Color } from 'blockchain-info-components'

export const getConfig = (coin, currency, data, decimals) => ({
  chart: {
    height: 105,
    type: 'line',
    data: {
      dateFormat: 'YYYY/mm/dd'
    }
  },
  credits: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    line: {
      color: Color(coin.toLowerCase()),
      lineWidth: 3
    }
  },
  series: [
    {
      data: data
    }
  ],
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
      return Currency.fiatToString({
        value: this.y,
        digits: decimals,
        unit: currency
      })
    }
  },
  title: {
    text: null
  },
  yAxis: {
    visible: false
  },
  xAxis: {
    visible: false,
    minPadding: 0,
    maxPadding: 0,
    type: 'datetime',
    gridLineColor: 'transparent'
  }
})
