import { FormattedMessage } from 'react-intl'
import { PriceChartPreferenceType } from 'data/preferences/types'
import React from 'react'

export const getPriceChartTime = (
  priceChartTime: PriceChartPreferenceType['time']
) => {
  switch (priceChartTime) {
    case 'day': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.day'
          defaultMessage='today'
        />
      )
    }
    case 'week': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.week'
          defaultMessage='this week'
        />
      )
    }
    case 'month': {
      return (
        <FormattedMessage
          id='scenes.home.pricechart.coinperformance.month'
          defaultMessage='this month'
        />
      )
    }
    case 'year': {
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
