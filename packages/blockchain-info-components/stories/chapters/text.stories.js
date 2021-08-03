import { withInfo } from '@storybook/addon-info'
import React from 'react'
import { addDecorator } from '@storybook/react'

import { Text } from '../../src'
import Layout from '../components/layout'

const sample =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Cras id tortor lectus.Pellentesque pulvinar sit amet massa quis auctor.Ut consectetur dui mi, eu vestibulum felis ornare sit amet.Sed vel interdum massa, a gravida arcu.Vestibulum sed dictum elit.Nulla pharetra euismod quam, ut iaculis nisi tincidunt et.Donec justo neque, pulvinar sit amet sollicitudin nec, fermentum vel sem.Mauris varius ultrices viverra.Donec condimentum velit id aliquam aliquet.Donec dapibus, tortor vehicula mollis venenatis, felis nisi porttitor nisl, vitae imperdiet leo tortor sed eros.'

export default {
  title: 'Text',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
}

export const _Text = () => <Text>{sample}</Text>
export const ColouredText = () => <Text color='blue600'>{sample}</Text>

ColouredText.story = {
  name: 'Coloured text'
}

export const BoldText = () => <Text weight={900}>{sample}</Text>

BoldText.story = {
  name: 'Bold text'
}

export const CapitalizedText = () => <Text capitalize>{sample}</Text>

CapitalizedText.story = {
  name: 'Capitalized text'
}

export const ItalicText = () => <Text italic>{sample}</Text>

ItalicText.story = {
  name: 'Italic text'
}

export const UppercaseText = () => <Text uppercase>{sample}</Text>

UppercaseText.story = {
  name: 'Uppercase text'
}

export const AltfontText = () => <Text altFont>{sample}</Text>

AltfontText.story = {
  name: 'Altfont text'
}
