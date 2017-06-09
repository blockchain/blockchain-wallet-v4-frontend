import React from 'react'
import {connect} from 'react-redux'
import { prop } from 'ramda'

const BitcoinDisplay = ({amount, ...rest}) => {
  let result = 'N/A'
  let convertedAmount = 0

  if (rest.bitcoin) {
    switch (rest.unit) {
      case 'mBTC':
        convertedAmount = parseFloat((amount * 1000).toFixed(5))
        break
      case 'bits':
        convertedAmount = parseFloat((amount * 1000000).toFixed(2))
        break
      default: convertedAmount = amount
    }
    result = `${convertedAmount} ${rest.unit}`
  } else {
    var ratio = prop(rest.currency, rest.rates).last
    convertedAmount = parseFloat((amount * ratio).toFixed(2))
    result = `${convertedAmount} ${rest.currency}`
  }

  return (
    <span className={rest.className}>{result}</span>
  )
}

function mapStateToProps (state) {
  return {
    bitcoin: true,
    unit: 'mBTC',
    currency: 'EUR',
    rates: {
      'USD': {'15m': 2812.17, 'last': 2812.17, 'buy': 2810, 'sell': 2812.17, 'symbol': '$'},
      'ISK': {'15m': 278601.68, 'last': 278601.68, 'buy': 278386.7, 'sell': 278601.68, 'symbol': 'kr'},
      'HKD': {'15m': 21927.53, 'last': 21927.53, 'buy': 21910.61, 'sell': 21927.53, 'symbol': '$'},
      'TWD': {'15m': 84716.66, 'last': 84716.66, 'buy': 84651.29, 'sell': 84716.66, 'symbol': 'NT$'},
      'CHF': {'15m': 2726.56, 'last': 2726.56, 'buy': 2724.45, 'sell': 2726.56, 'symbol': 'CHF'},
      'EUR': {'15m': 2514.92, 'last': 2514.92, 'buy': 2512.98, 'sell': 2514.92, 'symbol': '€'},
      'DKK': {'15m': 18703.25, 'last': 18703.25, 'buy': 18688.82, 'sell': 18703.25, 'symbol': 'kr'},
      'CLP': {'15m': 1870655.48, 'last': 1870655.48, 'buy': 1869212, 'sell': 1870655.48, 'symbol': '$'},
      'CAD': {'15m': 3802.4, 'last': 3802.4, 'buy': 3799.47, 'sell': 3802.4, 'symbol': '$'},
      'INR': {'15m': 180683.33, 'last': 180683.33, 'buy': 180543.9, 'sell': 180683.33, 'symbol': '₹'},
      'CNY': {'15m': 19128.1, 'last': 19128.1, 'buy': 19113.34, 'sell': 19128.1, 'symbol': '¥'},
      'THB': {'15m': 95810.63, 'last': 95810.63, 'buy': 95736.7, 'sell': 95810.63, 'symbol': '฿'},
      'AUD': {'15m': 3732.31, 'last': 3732.31, 'buy': 3729.43, 'sell': 3732.31, 'symbol': '$'},
      'SGD': {'15m': 3889.23, 'last': 3889.23, 'buy': 3886.23, 'sell': 3889.23, 'symbol': '$'},
      'KRW': {'15m': 3158882.44, 'last': 3158882.44, 'buy': 3156444.9, 'sell': 3158882.44, 'symbol': '₩'},
      'JPY': {'15m': 309446.97, 'last': 309446.97, 'buy': 309208.18, 'sell': 309446.97, 'symbol': '¥'},
      'PLN': {'15m': 10557.96, 'last': 10557.96, 'buy': 10549.82, 'sell': 10557.96, 'symbol': 'zł'},
      'GBP': {'15m': 2208.02, 'last': 2208.02, 'buy': 2206.32, 'sell': 2208.02, 'symbol': '£'},
      'SEK': {'15m': 24560.85, 'last': 24560.85, 'buy': 24541.9, 'sell': 24560.85, 'symbol': 'kr'},
      'NZD': {'15m': 3902.54, 'last': 3902.54, 'buy': 3899.53, 'sell': 3902.54, 'symbol': '$'},
      'BRL': {'15m': 9170.26, 'last': 9170.26, 'buy': 9163.19, 'sell': 9170.26, 'symbol': 'R$'},
      'RUB': {'15m': 160035.81, 'last': 160035.81, 'buy': 159912.32, 'sell': 160035.81, 'symbol': 'RUB'}
    }
  }
}

export default connect(mapStateToProps)(BitcoinDisplay)
