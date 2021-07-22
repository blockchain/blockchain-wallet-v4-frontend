import React from 'react'

import Layout from '../components/layout'
import Welcome from '../components/welcome'

export default {
  title: 'Welcome',
  decorators: [(story) => <Layout>{story()}</Layout>]
}

export const Introduction = () => <Welcome />
