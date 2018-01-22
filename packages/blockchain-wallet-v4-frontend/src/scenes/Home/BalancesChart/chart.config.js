export default (coinData) => ({
  chart: {
    type: 'pie'
  },
  title: {
    text: 'Your balances'
  },
  plotOptions: {
    pie: {
      shadow: false,
      center: ['50%', '50%']
    }
  },
  tooltip: {
    valueSuffix: '%'
  },
  series: [{
    name: 'Balances',
    data: coinData,
    size: '60%',
    innerSize: '60%',
    dataLabels: {
      formatter: function () {
        return this.y > 1 ? this.point.name : null
      },
      color: '#000000'
    }
  }],
  credits: {
    enabled: false
  }
})
