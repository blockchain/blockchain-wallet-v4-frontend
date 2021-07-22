import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Banner } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Banners',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const Alert = () => <Banner type='alert'>This is an alert banner</Banner>
export const Default = () => <Banner>Hello, I'm a standard banner!</Banner>
export const Success = () => <Banner type='success'>Hooray, something worked!</Banner>
export const Warning = () => <Banner type='warning'>Something really bad happened</Banner>
export const Caution = () => (
  <Banner type='caution'>Be careful, use caution with this action</Banner>
)
export const Informational = () => <Banner type='informational'>Watch Only</Banner>
