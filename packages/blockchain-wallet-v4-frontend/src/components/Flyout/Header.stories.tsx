import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react/types-6-0'

import Header, { Props } from './Header'

export default {
  argTypes: {
    mode: {
      options: ['close', 'back'],
      type: 'select'
    }
  },
  args: {
    'data-e2e': 'foooo',
    mode: 'back'
  },
  component: Header,
  decorators: [
    (Story) => (
      <IntlProvider locale='en'>
        <Story />
      </IntlProvider>
    )
  ],
  title: 'Flyouts/Header'
} as Meta

export const BackArrowHeader: Story<Props> = (args) => (
  <Header {...args} onClick={action('back arrow clicked')}>
    Buy Bitcoin
  </Header>
)

export const CloseOnlyHeader: Story<Props> = (args) => (
  <Header {...args} mode='close' onClick={action('close button clicked')} />
)

export const HeaderWithChildren: Story<Props> = (args) => (
  <Header {...args} onClick={action('back arrow clicked')}>
    <FormattedMessage
      id='modals.recurringbuys.get_started.buy_amount_of_currency'
      defaultMessage='Buy {amount} of {currency}'
      values={{ amount: '0.005', currency: 'BTC' }}
    />
  </Header>
)
