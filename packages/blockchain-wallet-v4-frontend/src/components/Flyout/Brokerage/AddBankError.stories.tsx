import React from 'react'
import { IntlProvider } from 'react-intl'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { BankStatusType } from 'data/types'

import AddBankError from './AddBankError'

export default {
  component: AddBankError,
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
  title: 'Flyouts/Brokerage/AddBankError'
} as ComponentMeta<typeof AddBankError>

const Template: ComponentStory<typeof AddBankError> = (args) => <AddBankError {...args} />

export const Default = Template.bind({})
Default.args = {
  bankStatus: BankStatusType.BANK_TRANSFER_ACCOUNT_NAME_MISMATCH,
  handleClose: () => {},
  retryAction: () => {}
}
