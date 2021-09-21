import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { combineReducers, createStore } from 'redux'

import { InterestUploadDocumentFormValueTypes } from '../../../data/types'
import AdditionalInformation from './AdditionalInformation'

const store = createStore(combineReducers({}))

export default {
  argTypes: {},
  args: {
    close: () => {},
    countryCode: 'UK',
    formValues: {} as InterestUploadDocumentFormValueTypes,
    handleSubmit: () => {},
    nextStep: () => {},
    previousStep: () => {}
  },
  component: AdditionalInformation,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <IntlProvider locale='en'>
          <div style={{ display: 'flex', height: '100vh', width: '480px' }}>{Story()}</div>
        </IntlProvider>
      </Provider>
    )
  ],
  title: 'Flyouts/InterestUploadDocuments/AdditionalInformation'
} as ComponentMeta<typeof AdditionalInformation>

export const Template: ComponentStory<typeof AdditionalInformation> = (args) => (
  <AdditionalInformation {...args} />
)

export const Default = Template.bind({})
