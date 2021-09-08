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
  paymentType: SBPaymentTypes.PAYMENT_CARD
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
  paymentType: SBPaymentTypes.FUNDS
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
  paymentType: SBPaymentTypes.BANK_TRANSFER
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
  paymentType: SBPaymentTypes.PAYMENT_CARD
}

export const WithPromo = Template.bind({})
WithPromo.args = {
  baseAmount: '0.001',
  baseCurrency: 'BTC',
  children: (
    <div style={{ border: '1px solid grey', borderRadius: '8px', padding: '24px' }}>
      This is a promo box that you can fill with whatever you want, but be aware, there&apos;s a
      180px height limit to this box.
    </div>
  ),
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
  paymentType: SBPaymentTypes.PAYMENT_CARD
}
