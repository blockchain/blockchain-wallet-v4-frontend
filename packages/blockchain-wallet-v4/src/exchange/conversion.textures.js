const btcRates = {
  USD: {
    '15m': 6589.79,
    last: 6589.79,
    buy: 6590.27,
    sell: 6589.32,
    symbol: '$'
  },
  AUD: {
    '15m': 8582.04,
    last: 8582.04,
    buy: 8582.65,
    sell: 8581.42,
    symbol: '$'
  },
  BRL: {
    '15m': 21562.43,
    last: 21562.43,
    buy: 21563.98,
    sell: 21560.87,
    symbol: 'R$'
  },
  CAD: {
    '15m': 8489.53,
    last: 8489.53,
    buy: 8490.15,
    sell: 8488.92,
    symbol: '$'
  },
  CHF: {
    '15m': 6594.77,
    last: 6594.77,
    buy: 6595.25,
    sell: 6594.29,
    symbol: 'CHF'
  },
  CLP: {
    '15m': 4194404.52,
    last: 4194404.52,
    buy: 4194706.86,
    sell: 4194102.18,
    symbol: '$'
  },
  CNY: {
    '15m': 43568.43,
    last: 43568.43,
    buy: 43571.57,
    sell: 43565.29,
    symbol: '¥'
  },
  DKK: {
    '15m': 42149.51,
    last: 42149.51,
    buy: 42152.55,
    sell: 42146.48,
    symbol: 'kr'
  },
  EUR: {
    '15m': 5738.07,
    last: 5738.07,
    buy: 5738.67,
    sell: 5737.48,
    symbol: '€'
  },
  GBP: {
    '15m': 4955.06,
    last: 4955.06,
    buy: 4955.42,
    sell: 4954.71,
    symbol: '£'
  },
  HKD: {
    '15m': 51416.55,
    last: 51416.55,
    buy: 51420.25,
    sell: 51412.84,
    symbol: '$'
  },
  INR: {
    '15m': 425700.76,
    last: 425700.76,
    buy: 425731.44,
    sell: 425670.07,
    symbol: '₹'
  },
  ISK: {
    '15m': 698133.67,
    last: 698133.67,
    buy: 698183.99,
    sell: 698083.35,
    symbol: 'kr'
  },
  JPY: {
    '15m': 747026.73,
    last: 747026.73,
    buy: 747183.66,
    sell: 746869.8,
    symbol: '¥'
  },
  KRW: {
    '15m': 7336286.98,
    last: 7336286.98,
    buy: 7336815.79,
    sell: 7335758.17,
    symbol: '₩'
  },
  NZD: {
    '15m': 9543.38,
    last: 9543.38,
    buy: 9544.07,
    sell: 9542.69,
    symbol: '$'
  },
  PLN: {
    '15m': 23989.49,
    last: 23989.49,
    buy: 23991.22,
    sell: 23987.76,
    symbol: 'zł'
  },
  RUB: {
    '15m': 383200.2,
    last: 383200.2,
    buy: 383227.83,
    sell: 383172.58,
    symbol: 'RUB'
  },
  SEK: {
    '15m': 55278.84,
    last: 55278.84,
    buy: 55282.83,
    sell: 55274.86,
    symbol: 'kr'
  },
  SGD: {
    '15m': 8966.56,
    last: 8966.56,
    buy: 8967.2,
    sell: 8965.91,
    symbol: '$'
  },
  THB: {
    '15m': 218385.92,
    last: 218385.92,
    buy: 218401.66,
    sell: 218370.18,
    symbol: '฿'
  },
  TWD: {
    '15m': 198754.81,
    last: 198754.81,
    buy: 198769.13,
    sell: 198740.48,
    symbol: 'NT$'
  }
}

const ethRates = {
  USD: { '15m': 295.63, last: 295.63, buy: 295.65, sell: 295.61, symbol: '$' },
  AUD: { '15m': 385.01, last: 385.01, buy: 385.03, sell: 384.98, symbol: '$' },
  BRL: { '15m': 967.33, last: 967.33, buy: 967.39, sell: 967.26, symbol: 'R$' },
  CAD: { '15m': 380.86, last: 380.86, buy: 380.88, sell: 380.83, symbol: '$' },
  CHF: {
    '15m': 295.85,
    last: 295.85,
    buy: 295.87,
    sell: 295.83,
    symbol: 'CHF'
  },
  CLP: {
    '15m': 188168.5,
    last: 188168.5,
    buy: 188181.22,
    sell: 188155.77,
    symbol: '$'
  },
  CNY: {
    '15m': 1954.56,
    last: 1954.56,
    buy: 1954.69,
    sell: 1954.43,
    symbol: '¥'
  },
  DKK: {
    '15m': 1890.9,
    last: 1890.9,
    buy: 1891.03,
    sell: 1890.77,
    symbol: 'kr'
  },
  EUR: { '15m': 256.45, last: 256.45, buy: 256.76, sell: 256.13, symbol: '€' },
  GBP: { '15m': 222.3, last: 222.3, buy: 222.31, sell: 222.28, symbol: '£' },
  HKD: {
    '15m': 2306.64,
    last: 2306.64,
    buy: 2306.79,
    sell: 2306.48,
    symbol: '$'
  },
  INR: {
    '15m': 19097.7,
    last: 19097.7,
    buy: 19098.99,
    sell: 19096.41,
    symbol: '₹'
  },
  ISK: {
    '15m': 31319.53,
    last: 31319.53,
    buy: 31321.64,
    sell: 31317.41,
    symbol: 'kr'
  },
  JPY: {
    '15m': 33713.23,
    last: 33713.23,
    buy: 33715.51,
    sell: 33710.95,
    symbol: '¥'
  },
  KRW: {
    '15m': 329118.96,
    last: 329118.96,
    buy: 329141.23,
    sell: 329096.7,
    symbol: '₩'
  },
  NZD: { '15m': 428.13, last: 428.13, buy: 428.16, sell: 428.1, symbol: '$' },
  PLN: {
    '15m': 1076.21,
    last: 1076.21,
    buy: 1076.28,
    sell: 1076.14,
    symbol: 'zł'
  },
  RUB: {
    '15m': 17191.05,
    last: 17191.05,
    buy: 17192.21,
    sell: 17189.88,
    symbol: 'RUB'
  },
  SEK: {
    '15m': 2479.91,
    last: 2479.91,
    buy: 2480.08,
    sell: 2479.74,
    symbol: 'kr'
  },
  SGD: { '15m': 402.26, last: 402.26, buy: 402.28, sell: 402.23, symbol: '$' },
  THB: {
    '15m': 9797.19,
    last: 9797.19,
    buy: 9797.85,
    sell: 9796.52,
    symbol: '฿'
  },
  TWD: {
    '15m': 8916.49,
    last: 8916.49,
    buy: 8917.1,
    sell: 8915.89,
    symbol: 'NT$'
  }
}

export { btcRates, ethRates }
