import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers } from 'redux'

import { SBPaymentTypes } from '@core/types'
import form from 'data/form/reducers'
import { BrokerageOrderType } from 'data/types'

import Navbar from './Navbar'

const store = configureStore({ reducer: combineReducers({ form }) })

export default {
  argTypes: {},
  component: Navbar,
  decorators: [
    (Story) => {
      return (
        <IntlProvider locale='en'>
          <div>{Story()}</div>
        </IntlProvider>
      )
    }
  ],
  title: 'Layout/Navigation'
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar />

export const Default = Template.bind({})
Default.args = {}
