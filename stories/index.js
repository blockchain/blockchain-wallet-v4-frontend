import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import { withInfo, setDefaults } from '@storybook/addon-info'

import Welcome from './welcome.js'
import { Button, PrimaryButton, SecondaryButton } from '../src'

// Set default settings for addon-info
setDefaults({
  inline: true
})

storiesOf('Welcome', module)
  .add('Introduction', () => <Welcome />)

storiesOf('Buttons', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('Button', () => <Button>Button</Button>)
  .add('Button rounded', () => <Button rounded>Button</Button>)
  .add('Button full width', () => <Button fullwidth>Button</Button>)
  .add('PrimaryButton', () => <PrimaryButton>Button</PrimaryButton>)
  .add('PrimaryButton rounded', () => <PrimaryButton rounded>Button</PrimaryButton>)
  .add('PrimaryButton full width', () => <PrimaryButton fullwidth>Button</PrimaryButton>)
  .add('SecondaryButton', () => <SecondaryButton>Button</SecondaryButton>)
  .add('SecondaryButton rounded', () => <SecondaryButton rounded>Button</SecondaryButton>)
  .add('SecondaryButton full width', () => <SecondaryButton fullwidth>Button</SecondaryButton>)
