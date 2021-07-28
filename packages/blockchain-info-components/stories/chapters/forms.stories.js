import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import {
  CheckBoxInput,
  DateInput,
  NumberInput,
  PasswordInput,
  RadioButtonInput,
  SelectInput,
  TextAreaInput,
  TextInput
} from '../../src'

addDecorator(withInfo)

export default {
  title: 'Forms',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const CheckBoxInputChecked = () => (
  <CheckBoxInput name='myCheckbox' checked>
    Label for myCheckbox
  </CheckBoxInput>
)

CheckBoxInputChecked.story = {
  name: 'CheckBox input checked'
}

export const CheckBoxInputUnchecked = () => (
  <CheckBoxInput name='myCheckbox'>Label for Checkbox</CheckBoxInput>
)

CheckBoxInputUnchecked.story = {
  name: 'CheckBox input unchecked'
}

export const CheckBoxInputDisabled = () => (
  <CheckBoxInput name='myCheckbox' disabled={`disabled`}>
    Disabled Checkbox
  </CheckBoxInput>
)

CheckBoxInputDisabled.story = {
  name: 'CheckBox input disabled'
}

export const _RadioButtonInput = () => (
  <RadioButtonInput name='myRadioButton' props={{ id: 'myRadioButton' }}>
    Label for myRadioButton
  </RadioButtonInput>
)

_RadioButtonInput.story = {
  name: 'RadioButton input'
}

export const _NumberInput = () => <NumberInput />

_NumberInput.story = {
  name: 'Number input'
}

export const _PasswordInput = () => <PasswordInput />

_PasswordInput.story = {
  name: 'Password input'
}

export const _TextAreaInput = () => <TextAreaInput />

_TextAreaInput.story = {
  name: 'TextArea input'
}

export const _DateInput = () => <DateInput />

_DateInput.story = {
  name: 'Date input'
}

export const _TextInput = () => <TextInput />

_TextInput.story = {
  name: 'Text input'
}

export const InvalidTextInput = () => <TextInput errorState='invalid' />

InvalidTextInput.story = {
  name: 'Invalid text input'
}

export const ValidTextInput = () => <NumberInput errorState='valid' />

ValidTextInput.story = {
  name: 'Valid text input'
}

export const _SelectInput = () => (
  <SelectInput
    elements={[
      {
        group: '',
        items: [
          { text: 'First item', value: 0 },
          { text: 'Second item', value: 1 },
          { text: 'Third item', value: 2 }
        ]
      }
    ]}
  />
)

_SelectInput.story = {
  name: 'Select input'
}

export const SelectInputWithTemplateDisplay = () => (
  <SelectInput
    elements={[
      {
        group: '',
        items: [
          { text: 'First item', value: 0 },
          { text: 'Second item', value: 1 },
          { text: 'Third item', value: 2 }
        ]
      }
    ]}
    templateDisplay={(item) => <div>{`!!! ${item.text} !!!`}</div>}
  />
)

SelectInputWithTemplateDisplay.story = {
  name: 'Select input with templateDisplay'
}

export const SelectInputWithTemplateItem = () => (
  <SelectInput
    elements={[
      {
        group: '',
        items: [
          { text: 'First item', value: 0 },
          { text: 'Second item', value: 1 },
          { text: 'Third item', value: 2 }
        ]
      }
    ]}
    templateItem={(item) => <div>{`!!! ${item.text} !!!`}</div>}
  />
)

SelectInputWithTemplateItem.story = {
  name: 'Select input with templateItem'
}

export const SelectInputDisabled = () => (
  <SelectInput
    elements={[
      {
        group: '',
        items: [
          { text: 'First item', value: 0 },
          { text: 'Second item', value: 1 },
          { text: 'Third item', value: 2 }
        ]
      }
    ]}
    disabled
  />
)

SelectInputDisabled.story = {
  name: 'Select input disabled'
}
