import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

export default (chartData, symbol, history) => {
  const total = chartData.reduce((acc, item) => (acc + Number(item.fiat)), 0)

  return (
    {
      chart: {
        height: 230
      },
      title: {
        y: 5,
        align: 'center',
        verticalAlign: 'middle',
        text: symbol + Currency.formatFiat(total)
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          animation: { duration: 0 },
          dataLabels: { enabled: false },
          events: {
            click: (evt) => total > 0 && history.push(`/${evt.point.id}/transactions`)
          }
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
        valuePrefix: `${symbol}`,
        pointFormat: '{point.y}'
      },
      series: [{
        type: 'pie',
        name: 'Amount',
        cursor: 'pointer',
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
