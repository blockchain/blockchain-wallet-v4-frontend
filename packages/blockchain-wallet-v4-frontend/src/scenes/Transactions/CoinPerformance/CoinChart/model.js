export const getConfig = (coin, currency, data) => ({
  chart: {
    height: 100,
    type: 'line'
  },
  credits: {
    enabled: false
  },
  legend: {
    enabled: false
  },
  series: [
    {
      data: data
    }
  ],
  tooltip: {
    enabled: false
  },
  title: {
    text: null
  },
  yAxis: {
    visible: false
  },
  xAxis: {
    visible: false
  }
})
