import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { CheckBoxInput, HiddenInput, NumberInput, PasswordInput, TextAreaInput, TextInput } from '../../src'

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
