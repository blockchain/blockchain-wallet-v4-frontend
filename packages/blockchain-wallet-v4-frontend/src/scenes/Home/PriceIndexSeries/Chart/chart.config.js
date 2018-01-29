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
    pointFormat: currency + ' {point.y}'
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
