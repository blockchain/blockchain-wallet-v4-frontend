import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers } from 'redux'
import { FormErrors } from 'redux-form'

import { SBPaymentTypes } from '@core/types'
import form from 'data/form/reducers'
import { BrokerageOrderType } from 'data/types'

import EnterAmount from './EnterAmount'

const store = configureStore({ reducer: combineReducers({ form }) })

export default {
  argTypes: {
    fiatCurrency: {
      options: ['USD', 'UK'],
      type: 'select'
    },
    orderType: {
      options: [...Object.values(BrokerageOrderType)],
      type: 'select'
    }
  },
  component: EnterAmount,
  decorators: [
    (Story) => {
      return (
        <Provider store={store}>
          <IntlProvider locale='en'>
            <div style={{ display: 'flex', height: '100vh' }}>
              <div style={{ border: '1px solid #ddd', width: '480px' }}>{Story()}</div>
            </div>
          </IntlProvider>
        </Provider>
      )
    }
  ],
  title: 'Flyouts/Brokerage/EnterAmount'
} as ComponentMeta<typeof EnterAmount>

const Template: ComponentStory<typeof EnterAmount> = (args) => <EnterAmount {...args} />

export const DefaultDeposit = Template.bind({})
DefaultDeposit.args = {
  fiatCurrency: 'USD',
  handleBack: () => {},
  handleMethodClick: () => {},
  // @ts-ignore
  orderType: BrokerageOrderType.DEPOSIT, // ts doesn't lke my union types
  paymentAccount: {
    addedAt: '2021-09-27T18:16:23.647Z',
    // @ts-ignore
    attributes: {},
    currency: 'USD',
    details: {
      accountName: 'LORETTA PAUL',
      accountNumber: '9060',
      bankAccountType: 'CHECKING',
      bankName: 'DagBank',
      routingNumber: '011900571'
    },
    id: '1ad3e223-f0e6-4d1f-aa10-790c1909ea2d',
    partner: 'YODLEE',
    state: 'ACTIVE'
  },
  paymentMethod: {
    currency: 'USD',
    eligible: true,
    limits: {
      max: '3100000',
      min: '100'
    },
    subTypes: [],
    type: SBPaymentTypes.BANK_TRANSFER
  }
}

export const BankTransferWithdrawal = Template.bind({})
BankTransferWithdrawal.args = {
  fee: '0',
  fiatCurrency: 'USD',
  handleBack: () => {},
  handleMethodClick: () => {},
  minWithdrawAmount: '1',
  orderType: BrokerageOrderType.WITHDRAW,
  paymentAccount: {
    addedAt: '2021-06-11T19:59:30.041Z',

    // @ts-ignore
    attributes: {},

    currency: 'USD',

    details: {
      accountName: 'Ralph K Jackson',
      accountNumber: '1234',
      bankAccountType: 'CHECKING',
      bankName: 'Ally Bank',
      routingNumber: '123456789'
    },

    id: '0788880f-8833-462b-b584-61711117367f',

    partner: 'YODLEE',
    state: 'ACTIVE'
  },
  paymentMethod: {
    currency: 'USD',
    eligible: true,
    limits: {
      max: '5000000',
      min: '1000'
    },
    subTypes: [],
    type: SBPaymentTypes.BANK_TRANSFER
  },
  withdrawableBalance: '5000'
}

export const BankAccountWithdrawal = Template.bind({})
BankAccountWithdrawal.args = {
  fee: '2500',
  fiatCurrency: 'USD',
  handleBack: () => {},
  handleMethodClick: () => {},
  minWithdrawAmount: '1',
  orderType: BrokerageOrderType.WITHDRAW,
  paymentAccount: {
    address: '******1234',
    // @ts-ignore
    agent: { account: '123456789' },

    currency: 'USD',
    fiat: true,
    id: '1ce999d3-e7a9-4219-bb6d-59799993ab98',
    name: 'Ralph K Jackson',
    state: 'ACTIVE',
    whitelisted: false
  },
  paymentMethod: {
    currency: 'USD',
    eligible: true,
    limits: {
      max: '2500000',
      min: '500'
    },
    subTypes: [],
    type: SBPaymentTypes.BANK_ACCOUNT
  },
  withdrawableBalance: '5000'
}

export const BankAccountWithdrawalNoAccount = Template.bind({})
BankAccountWithdrawalNoAccount.args = {
  fee: '2500',
  fiatCurrency: 'USD',
  handleBack: () => {},
  handleMethodClick: () => {},
  minWithdrawAmount: '1',
  orderType: BrokerageOrderType.WITHDRAW,
  paymentAccount: undefined,
  paymentMethod: {
    currency: 'USD',
    eligible: true,
    limits: {
      max: '2500000',
      min: '500'
    },
    subTypes: [],
    type: SBPaymentTypes.BANK_ACCOUNT
  },
  withdrawableBalance: '5000'
}

export const WithdrawalError = Template.bind({})
WithdrawalError.args = {
  fee: '2500',
  fiatCurrency: 'USD',
  formErrors: { amount: 'errrrr' } as FormErrors,
  handleBack: () => {},
  handleMethodClick: () => {},
  minWithdrawAmount: '1',
  orderType: BrokerageOrderType.WITHDRAW,
  paymentAccount: {
    address: '******1234',
    // @ts-ignore
    agent: { account: '123456789' },

    currency: 'USD',
    fiat: true,
    id: '1ce999d3-e7a9-4219-bb6d-59799993ab98',
    name: 'Ralph K Jackson',
    state: 'ACTIVE',
    whitelisted: false
  },
  paymentMethod: {
    currency: 'USD',
    eligible: true,
    limits: {
      max: '2500000',
      min: '500'
    },
    subTypes: [],
    type: SBPaymentTypes.BANK_ACCOUNT
  },
  withdrawableBalance: '5000'
}
