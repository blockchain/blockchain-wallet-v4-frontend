import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers } from 'redux'
import { FormErrors, reduxForm } from 'redux-form'

import { BSPaymentTypes } from '@core/types'
import form from 'data/form/reducers'
import { BrokerageOrderType } from 'data/types'

import AmountFieldInput, { Props } from '.'

const store = configureStore({ reducer: combineReducers({ form }) })

const AmountFieldForm = reduxForm<{}, Props>({
  form: 'AmountFieldInput'
})(AmountFieldInput)

export default {
  component: AmountFieldInput,
  decorators: [
    (Story) => {
      return (
        <Provider store={store}>
          <IntlProvider locale='en'>
            <div style={{ border: '1px solid #ddd', width: '480px' }}>{Story()}</div>
          </IntlProvider>
        </Provider>
      )
    }
  ],
  title: 'Form/Inputs/AmountFieldInput'
} as ComponentMeta<typeof AmountFieldInput>

const Template: ComponentStory<typeof AmountFieldInput> = (args) => <AmountFieldForm {...args} />

export const Default = Template.bind({})
Default.args = {
  amtError: false,
  coin: 'BTC',
  'data-e2e': 'fooo',
  fiatCurrency: 'USD',
  fix: 'FIAT',
  name: 'amount',
  onChange: () => {},
  quote: '0.0001',
  showCounter: true,
  showToggle: true
}

export const NoQuoteWithToggle = Template.bind({})
NoQuoteWithToggle.args = {
  amtError: false,
  'data-e2e': 'fooo',
  fiatCurrency: 'USD',
  fix: 'FIAT',
  name: 'amount',
  onChange: () => {},
  showCounter: false,
  showToggle: true
}

export const FiatOnly = Template.bind({})
FiatOnly.args = {
  amtError: false,
  'data-e2e': 'fooo',
  fiatCurrency: 'USD',
  fix: 'FIAT',
  name: 'amount',
  onChange: () => {},
  showCounter: false,
  showToggle: false
}
