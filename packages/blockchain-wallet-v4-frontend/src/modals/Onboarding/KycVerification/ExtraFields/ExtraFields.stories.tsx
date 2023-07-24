import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import KYC_RESPONSE_NEW from './kycResponse'
import KYC_RESPONSE from './kycResponseCountries'
import ExtraFields from './template.success'

const store = createStore(combineReducers({}))

export default {
  argTypes: {},
  args: {
    error: null,
    extraSteps: KYC_RESPONSE_NEW,
    formErrors: {},
    invalid: false,
    onSubmit: () => {},
    submitting: false
  },
  component: ExtraFields,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Pages/KYC/ExtraFields'
} as ComponentMeta<typeof ExtraFields>

const Template: ComponentStory<typeof ExtraFields> = (args) => <ExtraFields {...args} />

export const Default = Template.bind({})
