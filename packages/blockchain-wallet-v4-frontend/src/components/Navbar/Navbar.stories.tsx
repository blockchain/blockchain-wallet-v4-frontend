import React from 'react'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { BrowserRouter } from 'react-router-dom'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Navbar from './Navbar'

export default {
  argTypes: {},
  component: Navbar,
  decorators: [
    (Story) => {
      return (
        <BrowserRouter>
          <IntlProvider locale='en'>
            <div style={{ border: '1px solid #333', height: '600px' }}>{Story()}</div>
          </IntlProvider>
        </BrowserRouter>
      )
    }
  ],
  title: 'Layout/Navigation'
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />

const PrimaryNavItems = [
  {
    dest: '/home',
    e2e: 'homeLink',
    text: <FormattedMessage id='copy.home' defaultMessage='Home' />
  },
  {
    dest: '/prices',
    e2e: 'pricesLink',
    text: <FormattedMessage id='copy.prices' defaultMessage='Prices' />
  },
  {
    dest: '/earn',
    e2e: 'earnLink',
    text: <FormattedMessage id='copy.earn' defaultMessage='Earn' />
  },
  {
    dest: '/nfts/view',
    e2e: 'nftsLink',
    text: <FormattedMessage id='layouts.wallet.menuleft.navigation.nfts' defaultMessage='NFTs' />
  },
  {
    dest: '/dapps',
    e2e: 'dappsLink',
    text: <FormattedMessage id='copy.dapps' defaultMessage='Dapps' />
  }
]

export const Default = Template.bind({})
Default.args = {
  fabClickHandler: () => {},
  limitsClickHandler: () => {},
  logoutClickHandler: () => {},
  primaryNavItems: PrimaryNavItems,
  referAFriendHandler: () => {},
  refreshClickHandler: () => {}
}
