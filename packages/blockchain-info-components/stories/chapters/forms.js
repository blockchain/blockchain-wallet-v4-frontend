import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

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

storiesOf('Forms', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('CheckBox input checked', () => (
    <CheckBoxInput name='myCheckbox' checked>
      Label for myCheckbox
    </CheckBoxInput>
  ))
  .add('CheckBox input unchecked', () => (
    <CheckBoxInput name='myCheckbox'>Label for Checkbox</CheckBoxInput>
  ))
  .add('CheckBox input disabled', () => (
    <CheckBoxInput name='myCheckbox' disabled={`disabled`}>
      Disabled Checkbox
    </CheckBoxInput>
  ))
  .add('RadioButton input', () => (
    <RadioButtonInput name='myRadioButton' props={{ id: 'myRadioButton' }}>
      Label for myRadioButton
    </RadioButtonInput>
  ))
  .add('Number input', () => <NumberInput />)
  .add('Password input', () => <PasswordInput />)
  .add('TextArea input', () => <TextAreaInput />)
  .add('Date input', () => <DateInput />)
  .add('Text input', () => <TextInput />)
  .add('Invalid text input', () => <TextInput errorState='invalid' />)
  .add('Valid text input', () => <NumberInput errorState='valid' />)
  .add('Select input', () => (
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
  ))
  .add('Select input with templateDisplay', () => (
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
      templateDisplay={item => <div>{`!!! ${item.text} !!!`}</div>}
    />
  ))
  .add('Select input with templateItem', () => (
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
      templateItem={item => <div>{`!!! ${item.text} !!!`}</div>}
    />
  ))
  .add('Select input disabled', () => (
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
  ))
