import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { BankStatusType } from 'data/types'

import AddBankStatus from './AddBankStatus'

export default {
  component: AddBankStatus,
  decorators: [
    (Story) => {
      return (
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ border: '1px solid #ddd', width: '480px' }}>{Story()}</div>
          </div>
        </IntlProvider>
      )
    }
  ],
  title: 'Flyouts/Brokerage/AddBankStatus'
} as ComponentMeta<typeof AddBankStatus>

const Template: ComponentStory<typeof AddBankStatus> = (args) => <AddBankStatus {...args} />

export const Default = Template.bind({})
Default.args = {
  bankStatus: BankStatusType.BANK_TRANSFER_ACCOUNT_NAME_MISMATCH,
  handleClose: () => {},
  retryAction: () => {}
}
