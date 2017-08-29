import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { CheckBoxInput, HiddenInput, NumberInput, PasswordInput, SelectInput, TextAreaInput, TextInput } from '../../src'

storiesOf('Forms', module)
    .addDecorator(story => (<Layout>{story()}</Layout>))
    .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
    .add('CheckBox input', () => <CheckBoxInput />)
    .add('Hidden input', () => <HiddenInput />)
    .add('Number input', () => <NumberInput />)
    .add('Password input', () => <PasswordInput />)
    .add('TextArea input', () => <TextAreaInput />)
    .add('Text input', () => <TextInput />)
    .add('Invalid text input', () => <TextInput errorState='invalid' />)
    .add('Valid text input', () => <NumberInput errorState='valid' />)
    .add('Select input', () => <SelectInput
      items={[{ text: 'First item', value: 0 },
              { text: 'Second item', value: 1 },
              { text: 'Third item', value: 2 }]}
      display='This is the display prop'
      expanded={false}
      searchEnabled
      handleBlur={() => { }}
      handleChange={() => { }}
      handleClick={() => { }}
      handleFocus={() => { }}
      meta={{touched: false, invalid: false, error: false}} />)
    .add('Select input expanded', () => <SelectInput
      items={[{ text: 'First item', value: 0 },
        { text: 'Second item', value: 1 },
        { text: 'Third item', value: 2 }]}
      display='This is the display prop'
      expanded
      searchEnabled
      handleBlur={() => { }}
      handleChange={() => { }}
      handleClick={() => { }}
      handleFocus={() => { }}
      meta={{ touched: false, invalid: false, error: false }} />)
