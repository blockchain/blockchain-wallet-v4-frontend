import React from 'react'
import { formValueSelector } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { path } from 'ramda'
import { selectors } from 'data'

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
  showRecurring: formValueSelector('coinifyRecurringCheckout')(state, 'recurring'),
  frequency: formValueSelector('coinifyRecurringCheckout')(state, 'frequency'),
  duration: formValueSelector('coinifyRecurringCheckout')(state, 'duration'),
  disableRecurringCheckbox: path(['coinify', 'disableRecurringCheckbox'], state),
  showModal: path(['coinify', 'showRecurringModal'], state),
  canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false),
  frequencyElements
})
