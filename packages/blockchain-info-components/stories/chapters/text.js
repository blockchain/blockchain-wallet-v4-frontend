import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import React from 'react'

import { Text } from '../../src'
import Layout from '../components/layout'

const sample =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Cras id tortor lectus.Pellentesque pulvinar sit amet massa quis auctor.Ut consectetur dui mi, eu vestibulum felis ornare sit amet.Sed vel interdum massa, a gravida arcu.Vestibulum sed dictum elit.Nulla pharetra euismod quam, ut iaculis nisi tincidunt et.Donec justo neque, pulvinar sit amet sollicitudin nec, fermentum vel sem.Mauris varius ultrices viverra.Donec condimentum velit id aliquam aliquet.Donec dapibus, tortor vehicula mollis venenatis, felis nisi porttitor nisl, vitae imperdiet leo tortor sed eros.'

storiesOf('Text', module)
  .addDecorator(story => <Layout>{story()}</Layout>)
  .addDecorator((story, context) =>
    withInfo({ text: 'Documentation', inline: true })(story)(context)
  )
  .add('Text', () => <Text>{sample}</Text>)
  .add('Coloured text', () => <Text color='blue600'>{sample}</Text>)
  .add('Bold text', () => <Text weight={900}>{sample}</Text>)
  .add('Capitalized text', () => <Text capitalize>{sample}</Text>)
  .add('Italic text', () => <Text italic>{sample}</Text>)
  .add('Uppercase text', () => <Text uppercase>{sample}</Text>)
  .add('Altfont text', () => <Text altFont>{sample}</Text>)
