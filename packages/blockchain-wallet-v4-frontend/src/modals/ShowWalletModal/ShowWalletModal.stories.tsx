import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ShowWalletModalComponent } from '.'
import { ShowWalletModal } from './ShowWalletModal'
import { IntlProvider } from 'react-intl'

export default {
  component: ShowWalletModal,
  title: 'Flyouts/ShowWallet',
  decorators: [(Story) => <IntlProvider locale='en'>{Story()}</IntlProvider>]
} as ComponentMeta<ShowWalletModalComponent>

const Template: ComponentStory<ShowWalletModalComponent> = (args) => {
  return <ShowWalletModal {...args} />
}

export const BTC = Template.bind({})
BTC.args = {}
