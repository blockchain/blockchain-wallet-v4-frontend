import { FormattedMessage } from 'react-intl'
import React from 'react'

export const getPriceChartTime = priceChartTime => {
  switch (priceChartTime) {
    case '1day': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.day'
          defaultMessage='today'
        />
      )
    }
    case '1week': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.week'
          defaultMessage='this week'
        />
      )
    }
    case '1month': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.month'
          defaultMessage='this month'
        />
      )
    }
    case '1year': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.year'
          defaultMessage='this year'
        />
      )
    }
    case 'all': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.all'
          defaultMessage='all time'
        />
      )
    }
    default: {
      return ''
    }
  }
}
