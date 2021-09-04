import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { OrderType, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'

import OrderSummary from './OrderSummary'

export default {
  component: OrderSummary,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <div style={{ display: 'flex', height: '100vh' }}>
          <div style={{ border: '1px solid #ddd', width: '480px' }}>{Story()}</div>
        </div>
      </IntlProvider>
    )
  ],
  title: 'Flyouts/Brokerage/OrderSummary'
} as ComponentMeta<typeof OrderSummary>

const Template: ComponentStory<typeof OrderSummary> = (args) => <OrderSummary {...args} />

export const Default = Template.bind({})
Default.args = {
  baseAmount: '0.001',
  baseCurrency: 'BTC',
  counterAmount: '100',
  currencySymbol: '$',
  handleClose: () => {},
  handleCompleteButton: () => {},
  handleOkButton: () => {},
  lockTime: 604800,
  orderState: 'FINISHED',
  orderType: OrderType.BUY,
  outputCurrency: 'BTC',
  paymentState: null,
  paymentType: SBPaymentTypes.PAYMENT_CARD,
  showInterestBanner: false
}

export const FundsSuccess = Template.bind({})
FundsSuccess.args = {
  baseAmount: '0.001',
  baseCurrency: 'BTC',
  counterAmount: '100',
  currencySymbol: '$',
  handleClose: () => {},
  handleCompleteButton: () => {},
  handleOkButton: () => {},
  lockTime: 0,
  orderState: 'FINISHED',
  orderType: OrderType.BUY,
  outputCurrency: 'BTC',
  paymentState: null,
  paymentType: SBPaymentTypes.FUNDS,
  showInterestBanner: false
}

export const BankSuccess = Template.bind({})
BankSuccess.args = {
  baseAmount: '0.001',
  baseCurrency: 'ETH',
  counterAmount: '100',
  currencySymbol: '$',
  handleClose: () => {},
  handleCompleteButton: () => {},
  handleOkButton: () => {},
  lockTime: 604800,
  orderState: 'FINISHED',
  orderType: OrderType.BUY,
  outputCurrency: 'ETH',
  paymentState: null,
  paymentType: SBPaymentTypes.BANK_TRANSFER,
  showInterestBanner: false
}

export const CardPending = Template.bind({})
CardPending.args = {
  baseAmount: '0.001',
  baseCurrency: 'BTC',
  counterAmount: '100',
  currencySymbol: '$',
  handleClose: () => {},
  handleCompleteButton: () => {},
  handleOkButton: () => {},
  lockTime: 604800,
  orderState: 'PENDING_DEPOSIT',
  orderType: OrderType.BUY,
  outputCurrency: 'BTC',
  paymentState: null,
  paymentType: SBPaymentTypes.PAYMENT_CARD,
  showInterestBanner: false
}
