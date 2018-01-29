export default (chartData, symbol) => {
  const total = chartData.reduce((acc, item) => (acc + Number(item.y)), 0).toFixed(2)
  return (
  {
    chart: {
      height: 230
    },
    title: {
      y: 5,
      align: 'center',
      verticalAlign: 'middle',
      text: symbol + total
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        animation: { duration: 0 },
        dataLabels: { enabled: false }
      },
      line: {
        marker: {
          enabled: false
        }
      },
      series: {
        states: {
          hover: {
            enabled: total > 0
          }
        }
      }
    },
    tooltip: {
      enabled: total > 0,
      valuePrefix: `${symbol}`
    },
    series: [{
      type: 'pie',
      name: 'Amount',
      data: total > 0
      ? chartData : [
        {
          y: 1,
          id: null,
          name: '',
          color: '#dddddd'
        }
      ],
      innerSize: '70%'
    }],
    credits: {
      enabled: false
    }
  }
  )
}
