import React from 'react'
import { formValueSelector } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { path } from 'ramda'
import { selectors, model } from 'data'

const { RECURRING_CHECKOUT_FORM } = model.coinify

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
  showRecurring: formValueSelector(RECURRING_CHECKOUT_FORM)(state, 'recurring'),
  frequency: formValueSelector(RECURRING_CHECKOUT_FORM)(state, 'frequency'),
  duration: formValueSelector(RECURRING_CHECKOUT_FORM)(state, 'duration'),
  disableRecurringCheckbox: path(['coinify', 'disableRecurringCheckbox'], state),
  showModal: path(['coinify', 'showRecurringModal'], state),
  canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(false),
  level: selectors.core.data.coinify.getLevel(state).getOrElse({}),
  frequencyElements
})
