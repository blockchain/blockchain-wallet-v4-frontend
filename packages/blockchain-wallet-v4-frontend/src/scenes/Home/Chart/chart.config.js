export const INTERVALS = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000
}

export const SCALES = {
  FIFTEENMIN: 15 * 60,
  HOUR: 60 * 60,
  TWOHOUR: 2 * 60 * 60,
  DAY: 24 * 60 * 60,
  FIVEDAY: 5 * 24 * 60 * 60
}

export const BTCSTART = 1282089600

export const ETHSTART = 1438992000

export const configure = (start, interval, currency, data) => ({
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
})
