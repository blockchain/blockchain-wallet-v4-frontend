import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers } from 'redux'
import { reduxForm } from 'redux-form'

import form from 'data/form/reducers'

import AmountFieldInput, { Props } from '.'

const store = configureStore({ reducer: combineReducers({ form }) })

const AmountFieldForm = reduxForm<{}, Props>({
  form: 'AmountFieldInput',
  initialValues: {
    amount_with_zero: '0'
  }
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
  amountError: false,
  coin: 'BTC',
  'data-e2e': 'amountField',
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
  amountError: false,
  'data-e2e': 'amountField',
  fiatCurrency: 'USD',
  fix: 'FIAT',
  name: 'amount',
  onChange: () => {},
  showCounter: false,
  showToggle: true
}

export const FiatOnly = Template.bind({})
FiatOnly.args = {
  amountError: false,
  'data-e2e': 'amountField',
  fiatCurrency: 'USD',
  fix: 'FIAT',
  name: 'amount',
  onChange: () => {},
  showCounter: false,
  showToggle: false
}

export const InitialValueZero = Template.bind({})
InitialValueZero.args = {
  amountError: false,
  'data-e2e': 'amountField',
  fiatCurrency: 'USD',
  fix: 'FIAT',
  name: 'amount_with_zero',
  onChange: () => {},
  showCounter: false,
  showToggle: false
}
