import React from 'react'
import { formValueSelector } from 'redux-form'
import { FormattedMessage } from 'react-intl'

const frequencyElements = [
  {
    group: '',
    items: [
      {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.recurring.weekly'
            defaultMessage='Weekly'
          />
        ),
        value: 'weekly'
      },
      {
        text: (
          <FormattedMessage
            id='scenes.buysell.coinify.recurring.monthly'
            defaultMessage='Monthly'
          />
        ),
        value: 'monthly'
      }
    ]
  }
]

export const getData = state => ({
  showRecurring: formValueSelector('coinifyRecurring')(state, 'recurring'),
  frequency: formValueSelector('coinifyRecurring')(state, 'frequency'),
  frequencyElements
  // defaultCurrency: getCurrency(state),
  // checkoutBusy: path(['coinify', 'checkoutBusy'], state),
  // paymentMedium: path(['coinify', 'medium'], state),
  // step: path(['coinify', 'checkoutStep'], state),
  // coinifyBusy: path(['coinify', 'coinifyBusy'], state),
  // canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false)
})
