import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers } from 'redux'

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
  orderType: BrokerageOrderType.DEPOSIT,
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

// export const NoPaymentAccount = Template.bind({})
// NoPaymentAccount.args = {
//   fiatCurrency: 'USD',
//   handleBack: () => {},
//   handleMethodClick: () => {},
//   orderType: BrokerageOrderType.DEPOSIT,
//   paymentMethod: {
//     currency: 'USD',
//     eligible: true,
//     limits: {
//       max: '3000000',
//       min: '100'
//     },
//     subTypes: [],
//     type: SBPaymentTypes.BANK_TRANSFER
//   }
// }

export const DefaultWithdrawal = Template.bind({})
DefaultWithdrawal.args = {
  fee: '20',
  fiatCurrency: 'USD',
  handleBack: () => {},
  handleMethodClick: () => {},
  orderType: BrokerageOrderType.WITHDRAW,
  paymentAccount: {
    address: 'foo',
    agent: {
      account: 'fooooo',
      accountType: 'Good one',
      address: '555 20th st. los angeles, ca',
      code: 'doooooo',
      country: 'US',
      name: 'thing',
      recipient: 'thingy',
      recipientAddress: 'yomomma.com',
      routingNumber: 'oooooasdfasdfa',
      swiftCode: 'adf4vbvbvnxn'
    },
    currency: 'USD',
    id: 'ddddd-ddddd-ddddd-d-ddddddd',
    name: 'a bank',
    state: 'ACTIVE',
    whitelisted: true
  },
  paymentMethod: {
    currency: 'USD',
    eligible: true,
    limits: {
      max: '3000000',
      min: '100'
    },
    subTypes: [],
    type: SBPaymentTypes.BANK_TRANSFER
  },
  withdrawableBalance: '5000'
}
