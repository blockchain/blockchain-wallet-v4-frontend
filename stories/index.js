import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Welcome } from '@storybook/react/demo'
import { Button, SecondaryButton } from '../src'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module)
  .add('with text', () => <Button>Hello Button</Button>)
  .add('Secondary Button', () => <SecondaryButton>Secondary Button</SecondaryButton>)
