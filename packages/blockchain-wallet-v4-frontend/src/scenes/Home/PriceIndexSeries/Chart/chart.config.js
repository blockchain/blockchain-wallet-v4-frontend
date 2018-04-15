import { Color } from 'blockchain-info-components'

export default (start, interval, currency, data) => ({
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
        return (currency + ' ' + this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
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
      return currency + ' ' + this.y.toLocaleString()
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
