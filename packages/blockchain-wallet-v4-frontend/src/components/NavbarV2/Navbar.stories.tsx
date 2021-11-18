import React from 'react'
import { IntlProvider } from 'react-intl'
import { configureStore } from '@reduxjs/toolkit'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers } from 'redux'

import form from 'data/form/reducers'

import Navbar from './Navbar'

export default {
  argTypes: {},
  component: Navbar,
  decorators: [
    (Story) => {
      return (
        <IntlProvider locale='en'>
          <div style={{ border: '1px solid #333', height: '600px' }}>{Story()}</div>
        </IntlProvider>
      )
    }
  ],
  title: 'Layout/Navigation'
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar />

export const Default = Template.bind({})
Default.args = {}
